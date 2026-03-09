import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BIG_API_URL = "https://api.bigregister.nl/zksrv/soap/4";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Zoek in BIG-register op kenmerken: geslacht (verplicht), achternaam, optioneel voorletters en geboortedatum. */
async function searchBigByName(
  familyName: string,
  opts: { dateOfBirth?: string; initials?: string; gender: "Man" | "Vrouw" }
): Promise<{ resultaten: { big_number: string; name: string }[]; error?: string }> {
  const name = String(familyName).trim();
  if (!name || name.length < 2) {
    return { resultaten: [], error: "Vul minimaal 2 tekens van je achternaam in." };
  }
  if (!opts.gender || !["Man", "Vrouw"].includes(opts.gender)) {
    return { resultaten: [], error: "Selecteer je geslacht (Man of Vrouw)." };
  }
  const genderCode = opts.gender === "Vrouw" ? "V" : "M";

  const initials = opts?.initials?.trim() ?? "";
  const dob = opts?.dateOfBirth?.trim();
  const parts = [
    "<ns:WebSite>Ribiz</ns:WebSite>",
    `<ns:Name>${escapeXml(name)}</ns:Name>`,
    initials ? `<ns:Initials>${escapeXml(initials)}</ns:Initials>` : "",
    `<ns:Gender>${genderCode}</ns:Gender>`,
    dob ? `<ns:DateOfBirth>${dob}</ns:DateOfBirth>` : "",
  ].filter(Boolean);
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://services.cibg.nl/ExternalUser">
  <soap:Body>
    <ns:listHcpApproxRequest>
${parts.map((p) => "      " + p).join("\n")}
    </ns:listHcpApproxRequest>
  </soap:Body>
</soap:Envelope>`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(BIG_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "http://services.cibg.nl/ExternalUser/ListHcpApprox4",
      },
      body: soapEnvelope,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.text();
      const faultMatch = body.match(/<faultstring[^>]*>([^<]+)</i) || body.match(/<Reason[^>]*>[\s\S]*?<Text[^>]*>([^<]+)</i);
      const detail = faultMatch ? faultMatch[1].trim() : null;
      const msg = detail || (res.status === 500
        ? "Zoeken op naam is momenteel niet beschikbaar. Vul je BIG-nummer handmatig in of zoek het op op bigregister.nl."
        : `BIG-register: ${res.status}`);
      return { resultaten: [], error: msg };
    }

    const xml = await res.text();
    const hasFault = /soap:Fault|<\/?Fault\b/.test(xml);
    if (hasFault) {
      const faultMatch = xml.match(/<faultstring[^>]*>([^<]+)</i) || xml.match(/<Reason[^>]*>[\s\S]*?<Text[^>]*>([^<]+)</i);
      const msg = faultMatch ? faultMatch[1].trim() : "BIG-register gaf een fout.";
      return { resultaten: [], error: msg };
    }

    const nameMatches = [...xml.matchAll(/<[^:>]*:?MailingName[^>]*>([^<]*)</gi)];
    const numberMatches = [...xml.matchAll(/<[^:>]*:?ArticleRegistrationNumber[^>]*>\s*(\d{11})\s*</gi)];
    const resultaten: { big_number: string; name: string }[] = [];
    for (let i = 0; i < nameMatches.length; i++) {
      const name = nameMatches[i][1].trim();
      if (!name) continue;
      const nameStart = nameMatches[i].index;
      const nameEnd = nameMatches[i].index + (nameMatches[i][0]?.length ?? 0);
      const nextNameStart = nameMatches[i + 1]?.index ?? xml.length;
      const firstNumberInBlock = numberMatches.find(
        (m) => m.index! > nameEnd && m.index! < nextNameStart
      );
      if (firstNumberInBlock?.[1]) {
        resultaten.push({ big_number: firstNumberInBlock[1], name });
      }
    }
    return { resultaten };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const isTimeout = message.includes("abort") || message.includes("timeout");
    return {
      resultaten: [],
      error: isTimeout ? "BIG-register reageerde niet op tijd." : message,
    };
  }
}

interface BigSearchRequest {
  family_name: string;
  birth_date?: string;
  initials?: string;
  gender?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as BigSearchRequest;
    const familyName = body?.family_name ?? "";
    let birthDate = body?.birth_date ? String(body.birth_date).trim() : undefined;
    if (birthDate) {
      const ddmmyyyy = birthDate.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (ddmmyyyy) birthDate = `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, "0")}-${ddmmyyyy[1].padStart(2, "0")}`;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        return new Response(
          JSON.stringify({ resultaten: [], error: "Geboortedatum formaat: JJJJ-MM-DD of DD-MM-JJJJ" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    const initials = body?.initials ? String(body.initials).trim() : undefined;
    const genderRaw = body?.gender ? String(body.gender).trim() : "";
    const gender = genderRaw === "Vrouw" ? "Vrouw" : genderRaw === "Man" ? "Man" : null;
    if (!gender) {
      return new Response(
        JSON.stringify({ resultaten: [], error: "Selecteer je geslacht (Man of Vrouw)." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { resultaten, error } = await searchBigByName(familyName, { dateOfBirth: birthDate, initials, gender });
    return new Response(
      JSON.stringify({ resultaten, error }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("big-search error:", e);
    return new Response(
      JSON.stringify({ resultaten: [], error: "Er is een fout opgetreden bij het zoeken." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
