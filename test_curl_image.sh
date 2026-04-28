#!/bin/bash
source .env
curl -s -X GET "$VITE_SUPABASE_URL/rest/v1/products?select=id,name,image" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" > out.json
ls -lh out.json
