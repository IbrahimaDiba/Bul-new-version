-- Exécutez ce SQL dans le SQL Editor de Supabase (https://supabase.com/dashboard)
-- Cela permet les opérations INSERT, UPDATE et DELETE sur la table games

-- Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Allow read access" ON games;
DROP POLICY IF EXISTS "Allow insert access" ON games;
DROP POLICY IF EXISTS "Allow update access" ON games;
DROP POLICY IF EXISTS "Allow delete access" ON games;
DROP POLICY IF EXISTS "Enable read access for all users" ON games;
DROP POLICY IF EXISTS "Enable insert for all users" ON games;
DROP POLICY IF EXISTS "Enable update for all users" ON games;
DROP POLICY IF EXISTS "Enable delete for all users" ON games;

-- Créer des policies qui autorisent toutes les opérations
CREATE POLICY "Allow full read access" ON games
  FOR SELECT USING (true);

CREATE POLICY "Allow full insert access" ON games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow full update access" ON games
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow full delete access" ON games
  FOR DELETE USING (true);
