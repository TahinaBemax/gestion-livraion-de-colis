DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Boucle à travers toutes les tables de la base de données
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        -- Supprimer chaque table
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE';
    END LOOP;
END $$;
