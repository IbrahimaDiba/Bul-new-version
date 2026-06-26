import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion du CORS (obligatoire pour les requêtes depuis le navigateur)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { products, price, currency, customer, success_url, error_url, payment_method } = body;

    // Récupération sécurisée de la clé NabooPay (jamais exposée au frontend)
    const nabooToken = Deno.env.get("NABOOPAY_TOKEN");

    if (!nabooToken) {
      return new Response(
        JSON.stringify({ error: "Clé NABOOPAY_TOKEN manquante dans Supabase." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Appel sécurisé à l'API NabooPay v2
    const nabooRes = await fetch("https://api.naboopay.com/api/v2/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nabooToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await nabooRes.json();

    if (!nabooRes.ok) {
      return new Response(
        JSON.stringify({ error: data.message || "Erreur NabooPay", details: data }),
        { status: nabooRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retourner le lien de paiement au frontend
    return new Response(
      JSON.stringify({ checkout_url: data.checkout_url, transaction_id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
