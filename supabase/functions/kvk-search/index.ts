import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const KVK_TEST_API_KEY = "l7xx1f2691f2520d487b902f4e0b57a0b197";
const ZOEKEN_V2_BASE_TEST = "https://api.kvk.nl/test/api/v2";
const ZOEKEN_V2_BASE_PROD = "https://api.kvk.nl/api/v2";
const BASEPROFIEL_V1_BASE_TEST = "https://api.kvk.nl/test/api/v1";
const BASEPROFIEL_V1_BASE_PROD = "https://api.kvk.nl/api/v1";

interface BinnenlandsAdres {
  type?: string;
  straatnaam?: string;
  huisnummer?: number;
  huisletter?: string;
  postcode?: string;
  plaats?: string;
}

interface KvkZoekenResult {
  kvkNummer: string;
  vestigingsnummer?: string;
  naam: string;
  adres?: { binnenlandsAdres?: BinnenlandsAdres };
  type?: string;
  actief?: string;
}

interface KvkZoekenResponse {
  resultaten: KvkZoekenResult[];
  totaal: number;
}

interface SbiItem {
  sbiCode?: string;
  sbiOmschrijving?: string;
  indHoofdactiviteit?: string;
}

interface KvkBasisprofielHoofdvestiging {
  vestigingsnummer?: string;
  eersteHandelsnaam?: string;
  websites?: string[];
  sbiActiviteiten?: SbiItem[];
  adressen?: Array<{ volledigAdres?: string; straatnaam?: string; huisnummer?: string; huisletter?: string; postcode?: string; plaats?: string }>;
}

interface KvkBasisprofielEigenaar {
  rechtsvorm?: string;
  uitgebreideRechtsvorm?: string;
}

interface KvkBasisprofielResponse {
  kvkNummer?: string;
  naam?: string;
  statutaireNaam?: string;
  handelsnamen?: string[];
  hoofdvestiging?: KvkBasisprofielHoofdvestiging;
  eigenaar?: KvkBasisprofielEigenaar;
}

function formatZoekenResult(r: KvkZoekenResult) {
  const adres = r.adres?.binnenlandsAdres;
  return {
    kvkNummer: r.kvkNummer,
    vestigingsnummer: r.vestigingsnummer ?? "",
    naam: r.naam ?? "",
    straatnaam: adres?.straatnaam ?? "",
    huisnummer: adres?.huisnummer != null ? String(adres.huisnummer) : "",
    huisletter: adres?.huisletter ?? "",
    postcode: adres?.postcode ?? "",
    plaats: adres?.plaats ?? "",
    actief: r.actief ?? "",
    type: r.type ?? "",
  };
}

async function fetchBasisprofiel(
  kvkNummer: string,
  baseUrl: string,
  apiKey: string
): Promise<Partial<{
  websites: string[];
  sbiActiviteiten: SbiItem[];
  statutaireNaam: string;
  handelsnamen: string[];
  rechtsvorm: string;
  sector: string;
}>> {
  const url = `${baseUrl}/basisprofielen?kvkNummer=${encodeURIComponent(kvkNummer)}`;
  const res = await fetch(url, {
    headers: { apikey: apiKey, Accept: "application/json" },
  });
  if (!res.ok) return {};
  const data: KvkBasisprofielResponse = await res.json();
  const hoofd = data.hoofdvestiging;
  const eigenaar = data.eigenaar;
  const sbiList = hoofd?.sbiActiviteiten ?? data.sbiActiviteiten ?? [];
  const hoofdsbi = sbiList.find((s) => s.indHoofdactiviteit === "Ja") ?? sbiList[0];
  return {
    websites: hoofd?.websites ?? [],
    sbiActiviteiten: sbiList,
    statutaireNaam: data.statutaireNaam ?? "",
    handelsnamen: data.handelsnamen ?? [],
    rechtsvorm: eigenaar?.rechtsvorm ?? eigenaar?.uitgebreideRechtsvorm ?? "",
    sector: hoofdsbi?.sbiOmschrijving ?? hoofdsbi?.sbiCode ?? "",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let query = "";
    let kvkNummer = "";
    if (req.method === "POST") {
      const body = (await req.json().catch(() => ({}))) as { q?: string; kvkNummer?: string };
      query = body.q ?? "";
      kvkNummer = String(body.kvkNummer ?? "").replace(/\D/g, "");
    } else {
      const url = new URL(req.url);
      query = url.searchParams.get("q") ?? "";
      kvkNummer = (url.searchParams.get("kvkNummer") ?? "").replace(/\D/g, "");
    }

    if (!query && kvkNummer.length !== 8) {
      return new Response(
        JSON.stringify({ error: "Voer een zoekterm of geldig KvK-nummer (8 cijfers) in" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("KVK_API_KEY") ?? KVK_TEST_API_KEY;
    const useProduction = Deno.env.get("KVK_API_BASE") === "production" || !!Deno.env.get("KVK_API_KEY");
    const zoekenBase = useProduction ? ZOEKEN_V2_BASE_PROD : ZOEKEN_V2_BASE_TEST;
    const basisprofielBase = useProduction ? BASEPROFIEL_V1_BASE_PROD : BASEPROFIEL_V1_BASE_TEST;

    const searchUrl =
      kvkNummer.length === 8
        ? `${zoekenBase}/zoeken?kvkNummer=${encodeURIComponent(kvkNummer)}`
        : `${zoekenBase}/zoeken?naam=${encodeURIComponent(query)}`;

    const searchRes = await fetch(searchUrl, {
      headers: { apikey: apiKey, Accept: "application/json" },
    });

    if (!searchRes.ok) {
      return new Response(
        JSON.stringify({ resultaten: [], totaal: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData: KvkZoekenResponse = await searchRes.json();
    const resultaten = searchData.resultaten ?? [];

    const withBasisprofiel = kvkNummer.length === 8 && resultaten.length > 0;

    const out = await Promise.all(
      resultaten.slice(0, 5).map(async (r) => {
        const zoeken = formatZoekenResult(r);
        if (!withBasisprofiel) {
          return zoeken;
        }
        const extra = await fetchBasisprofiel(r.kvkNummer, basisprofielBase, apiKey);
        return {
          ...zoeken,
          websites: extra.websites ?? [],
          sbiActiviteiten: extra.sbiActiviteiten ?? [],
          statutaireNaam: extra.statutaireNaam ?? "",
          handelsnamen: extra.handelsnamen ?? [],
          rechtsvorm: extra.rechtsvorm ?? "",
          sector: extra.sector ?? "",
        };
      })
    );

    return new Response(
      JSON.stringify({ resultaten: out, totaal: searchData.totaal ?? 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("KVK search error:", err);
    return new Response(
      JSON.stringify({ resultaten: [], totaal: 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
