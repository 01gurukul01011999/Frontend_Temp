Backend README

This backend uses `pg` Pool to connect to a Postgres database (Supabase-compatible).

Required environment variables (set in `Backend/.env` or system env):
- DATABASE_URL (preferred) or SUPABASE_DB_URL or SUPABASE_URL
  - This should be a full Postgres connection string (postgres://user:pass@host:5432/dbname)
  - Get it from Supabase dashboard → Settings → Database → Connection string.
- PORT (optional, default 4000)
- JWT_SECRET (optional)

If you see `getaddrinfo ENOTFOUND <host>` when starting, check:
- The host is spelled correctly in the connection string.
- Your machine/network can resolve public DNS names (try `nslookup <host>`).
- If using a cloud/development environment, ensure outbound connections to port 5432 are allowed.
