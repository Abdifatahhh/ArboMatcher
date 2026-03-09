import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const KVK_TEST_API_KEY = "l7xx1f2691f2520d487b902f4e0b57a0b197";
const KVK_API_BASE_DEFAULT = "https://api.kvk.nl/test/api/v2";
const KVK_API_BASE_PRODUCTION = "https://api.kvk.nl/api/v2";

interface KvkSearchResult {
  kvkNummer: string;
  vestigingsnummer?: string;
  naam: string;
  adres?: {
    binnenlandsAdres?: {
      type: string;
      straatnaam?: string;
      huisnummer?: number;
      postcode?: string;
      plaats?: string;
    };
  };
  type: string;
}

interface KvkSearchResponse {
  pagina: number;
  resultatenPerPagina: number;
  totaal: number;
  resultaten: KvkSearchResult[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    let query = url.searchParams.get("q") || "";
    let kvkNummer = url.searchParams.get("kvkNummer") || "";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({})) as { q?: string; kvkNummer?: string };
      query = body.q ?? query;
      kvkNummer = body.kvkNummer ?? kvkNummer;
    }

    if (!query && !kvkNummer) {
      return new Response(
        JSON.stringify({ error: "Voer een zoekterm of KVK-nummer in" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get("KVK_API_KEY") || KVK_TEST_API_KEY;
    const useProduction = Deno.env.get("KVK_API_BASE") === "production" || !!Deno.env.get("KVK_API_KEY");
    const base = useProduction ? KVK_API_BASE_PRODUCTION : KVK_API_BASE_DEFAULT;
    let searchUrl = `${base}/zoeken?`;

    if (kvkNummer) {
      searchUrl += `kvkNummer=${encodeURIComponent(kvkNummer)}`;
    } else if (query) {
      searchUrl += `naam=${encodeURIComponent(query)}`;
    }

    const response = await fetch(searchUrl, {
      headers: {
        "apikey": apiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const empty = { resultaten: [], totaal: 0 };
      return new Response(JSON.stringify(empty), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data: KvkSearchResponse = await response.json();

    const formattedResults = data.resultaten.map((result) => ({
      kvkNummer: result.kvkNummer,
      vestigingsnummer: result.vestigingsnummer,
      naam: result.naam,
      straatnaam: result.adres?.binnenlandsAdres?.straatnaam || "",
      huisnummer: result.adres?.binnenlandsAdres?.huisnummer || "",
      postcode: result.adres?.binnenlandsAdres?.postcode || "",
      plaats: result.adres?.binnenlandsAdres?.plaats || "",
      type: result.type,
    }));

    return new Response(
      JSON.stringify({
        resultaten: formattedResults,
        totaal: data.totaal,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("KVK search error:", error);
    return new Response(
      JSON.stringify({ resultaten: [], totaal: 0 }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
