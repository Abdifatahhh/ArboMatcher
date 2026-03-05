/**
 * BIG-nummer check via Supabase Edge Function (roept RIBIZ/BIG-register aan).
 * Uses direct fetch so we always show the response, including 4xx/5xx.
 */

export interface BigCheckResult {
  formatValid: boolean;
  registerChecked: boolean;
  found: boolean;
  message: string;
  name?: string;
  error?: string;
}

const getConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL ?? '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  return { url, key };
};

/**
 * Controleer een BIG-nummer direct via de BIG-check API (formaat + optioneel register).
 */
export async function checkBigNumber(
  bigNumber: string,
  options?: { skipRegisterCheck?: boolean }
): Promise<BigCheckResult> {
  const raw = bigNumber == null ? '' : String(bigNumber);
  const bigStr = raw.replace(/\s/g, '').trim();
  const { url, key } = getConfig();

  if (!url || !key) {
    return {
      formatValid: false,
      registerChecked: false,
      found: false,
      message: 'Supabase-config ontbreekt (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
    };
  }

  const functionUrl = `${url.replace(/\/$/, '')}/functions/v1/big-check`;

  let res: Response;
  try {
    res = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        big_number: bigStr,
        skip_register_check: options?.skipRegisterCheck ?? false,
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      formatValid: false,
      registerChecked: false,
      found: false,
      message: 'API niet bereikbaar. Controleer netwerk en of de Edge Function is gedeployed.',
      error: msg,
    };
  }

  let data: BigCheckResult | null = null;
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text) as BigCheckResult;
  } catch {
    // geen geldige JSON
  }

  const fallback: BigCheckResult = {
    formatValid: false,
    registerChecked: false,
    found: false,
    message: data?.message ?? (res.ok ? 'Geen antwoord van de server.' : `Fout van de server (${res.status}).`),
    error: data?.error,
  };

  if (data && typeof data.formatValid === 'boolean') {
    return {
      formatValid: data.formatValid,
      registerChecked: data.registerChecked ?? false,
      found: data.found ?? false,
      message: data.message ?? fallback.message,
      name: data.name,
      error: data.error,
    };
  }

  return fallback;
}
