#!/bin/bash
source .env
curl -s -X GET "$VITE_SUPABASE_URL/rest/v1/games?select=id,status,home_team_id,away_team_id" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY"
