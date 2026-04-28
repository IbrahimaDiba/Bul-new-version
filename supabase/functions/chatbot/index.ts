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
    const { message, context } = await req.json();
    const groqKey = Deno.env.get("GROQ_API_KEY");

    if (!groqKey) {
      return new Response(JSON.stringify({ error: "Clé GROQ_API_KEY manquante dans Supabase." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Requête sécurisée vers Groq
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${groqKey}` 
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await res.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message || "Erreur Groq" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ text: data.choices[0].message.content }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
