-- Exécutez ce SQL dans le SQL Editor de Supabase (https://supabase.com/dashboard)
-- Cela permet les opérations INSERT, UPDATE et DELETE sur game_player_stats

-- Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Allow read access" ON game_player_stats;
DROP POLICY IF EXISTS "Allow insert access" ON game_player_stats;
DROP POLICY IF EXISTS "Allow update access" ON game_player_stats;
DROP POLICY IF EXISTS "Allow delete access" ON game_player_stats;
DROP POLICY IF EXISTS "Enable read access for all users" ON game_player_stats;
DROP POLICY IF EXISTS "Enable insert for all users" ON game_player_stats;
DROP POLICY IF EXISTS "Enable update for all users" ON game_player_stats;
DROP POLICY IF EXISTS "Enable delete for all users" ON game_player_stats;

-- Créer des policies qui autorisent toutes les opérations
CREATE POLICY "Allow full read access" ON game_player_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow full insert access" ON game_player_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow full update access" ON game_player_stats
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow full delete access" ON game_player_stats
  FOR DELETE USING (true);
