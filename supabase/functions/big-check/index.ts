import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BIG_API_URL = "https://api.bigregister.nl/zksrv/soap/4";

/** BIG-nummer: 8 of 9 cijfers */
function isValidBigFormat(big: string): boolean {
  const cleaned = String(big).replace(/\s/g, "");
  return /^[0-9]{8,9}$/.test(cleaned);
}

/** Roep RIBIZ Openbaar V4 SOAP API aan om BIG op te zoeken. */
async function checkBigInRegister(bigNumber: string): Promise<{
  found: boolean;
  name?: string;
  error?: string;
}> {
  const cleaned = String(bigNumber).replace(/\s/g, "");
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://services.cibg.nl/ExternalUser">
  <soap:Body>
    <ns:listHcpApproxRequest>
      <ns:WebSite>Ribiz</ns:WebSite>
      <ns:RegistrationNumber>${cleaned}</ns:RegistrationNumber>
    </ns:listHcpApproxRequest>
  </soap:Body>
</soap:Envelope>`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
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
      return { found: false, error: `BIG-register request failed: ${res.status}` };
    }

    const xml = await res.text();
    const hasFault = /soap:Fault|<\/?Fault\b/.test(xml);
    if (hasFault) {
      const faultMatch = xml.match(/<faultstring[^>]*>([^<]+)</i) || xml.match(/<Reason[^>]*>[\s\S]*?<Text[^>]*>([^<]+)</i);
      const msg = faultMatch ? faultMatch[1].trim() : "BIG-register returned an error";
      return { found: false, error: msg };
    }

    const nameMatch = xml.match(/<[^:>]*:?MailingName[^>]*>([^<]*)</i);
    const name = nameMatch ? nameMatch[1].trim() : undefined;
    const hasResult =
      /ArticleRegistrationNumber[^>]*>\s*[\d]+/.test(xml) ||
      (xml.includes("MailingName") && (name?.length ?? 0) > 0);
    return { found: !!hasResult, name: name || undefined };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const isTimeout = message.includes("abort") || message.includes("timeout");
    return {
      found: false,
      error: isTimeout ? "BIG-register reageerde niet op tijd." : message,
    };
  }
}

interface BigCheckRequest {
  big_number: string;
  skip_register_check?: boolean;
}

interface BigCheckResponse {
  formatValid: boolean;
  registerChecked: boolean;
  found: boolean;
  message: string;
  name?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = (await req.json()) as BigCheckRequest;
    const raw = body?.big_number;
    const bigNumber = (raw == null ? "" : String(raw)).replace(/\s/g, "").trim();
    const skipRegister = body?.skip_register_check === true;

    if (!bigNumber) {
      return new Response(
        JSON.stringify({
          formatValid: false,
          registerChecked: false,
          found: false,
          message: "Geen BIG-nummer opgegeven",
        } as BigCheckResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formatValid = isValidBigFormat(bigNumber);
    if (!formatValid) {
      return new Response(
        JSON.stringify({
          formatValid: false,
          registerChecked: false,
          found: false,
          message: "Ongeldig formaat. BIG-nummer bestaat uit 8 of 9 cijfers.",
        } as BigCheckResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (skipRegister) {
      return new Response(
        JSON.stringify({
          formatValid: true,
          registerChecked: false,
          found: false,
          message: "Formaat is geldig. Register-check overgeslagen.",
        } as BigCheckResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const register = await checkBigInRegister(bigNumber);
    const found = register.found;
    const message = found
      ? (register.name ? `Gevonden in BIG-register: ${register.name}` : "BIG-nummer staat in het register.")
      : (register.error || "BIG-nummer niet gevonden in het register.");

    return new Response(
      JSON.stringify({
        formatValid: true,
        registerChecked: true,
        found,
        message,
        name: register.name,
        error: register.error,
      } as BigCheckResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("big-check error:", e);
    return new Response(
      JSON.stringify({
        formatValid: false,
        registerChecked: false,
        found: false,
        message: "Er is een fout opgetreden bij het controleren.",
        error: e instanceof Error ? e.message : String(e),
      } as BigCheckResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
