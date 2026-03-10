import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type DeleteResult = { ok?: boolean; target_user_id?: string; conversations_deleted?: number; messages_in_deleted_conversations?: number };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({})) as {
      userId?: string;
      accessToken?: string;
      supabaseUrl?: string;
    };
    const userId = typeof body.userId === "string" ? body.userId : null;
    const token = (typeof body.accessToken === "string" ? body.accessToken : req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "")?.trim()) ?? "";
    const authBaseUrl = typeof body.supabaseUrl === "string" && body.supabaseUrl.startsWith("http")
      ? body.supabaseUrl.replace(/\/$/, "")
      : Deno.env.get("SUPABASE_URL") ?? "";

    if (!userId || !token) {
      return new Response(
        JSON.stringify({ error: "userId en accessToken zijn verplicht." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userUrl = `${authBaseUrl}/auth/v1/user`;
    const authRes = await fetch(userUrl, {
      headers: { "Authorization": `Bearer ${token}`, "apikey": supabaseAnonKey },
    });
    const authJson = await authRes.json();
    const callerId = authRes.ok && authJson?.id ? authJson.id : null;

    if (!callerId) {
      return new Response(
        JSON.stringify({ error: "Sessie verlopen. Log opnieuw in." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .single();

    if (profile?.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Alleen beheerders kunnen gebruikers verwijderen." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (userId === callerId) {
      return new Response(
        JSON.stringify({ error: "Je kunt je eigen account niet verwijderen." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: deleteResult, error: deleteDataError } = await userClient
      .rpc("admin_delete_user_by_admin", { p_target_user_id: userId });

    if (deleteDataError) {
      console.error("admin_delete_user_by_admin error:", deleteDataError.message, deleteDataError.code);
      const msg = deleteDataError.message ?? "Verwijderen van profiel en data mislukt.";
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = deleteResult as DeleteResult | null;
    if (!result || result.ok !== true) {
      console.error("admin_delete_user_by_admin gaf geen ok=true:", deleteResult);
      return new Response(
        JSON.stringify({ error: "Verwijderen mislukt: RPC gaf geen succes terug." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("admin_delete_user_by_admin ok:", {
      target_user_id: result.target_user_id,
      conversations_deleted: result.conversations_deleted,
      messages_in_deleted_conversations: result.messages_in_deleted_conversations,
    });

    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("Auth delete error:", deleteAuthError.message);
      const isNotFound = deleteAuthError.message?.toLowerCase().includes("not found") ?? false;
      const msg = isNotFound
        ? "Applicatiedata verwijderd. Auth-gebruiker bestond niet of was al verwijderd."
        : "Applicatiedata verwijderd, maar auth-account kon niet worden verwijderd: " + (deleteAuthError.message ?? "onbekende fout");
      return new Response(
        JSON.stringify({ error: msg }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Gebruiker en alle gekoppelde data zijn verwijderd." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
