# Apply Database Migrations

Before running the seed script, you need to apply all database migrations in Supabase.

## Steps:

### 1. Go to Supabase Dashboard
- Open https://supabase.com/dashboard
- Select your project: **Sync Script**

### 2. Open SQL Editor
- Click **SQL Editor** in the left sidebar
- Click **New query**

### 3. Apply Each Migration (in order)

Copy and paste each migration file content into the SQL Editor and click **Run**.

**Apply in this exact order:**

1. `supabase/migrations/001_init_schema.sql` - Creates all tables
2. `supabase/migrations/002_enable_rls.sql` - Enables Row Level Security
3. `supabase/migrations/003_performance_indexes.sql` - Adds indexes
4. `supabase/migrations/004_notifications.sql` - Adds notification tables
5. `supabase/migrations/005_add_is_public.sql` - Adds is_public column
6. `supabase/migrations/006_enable_pgvector.sql` - Enables vector extension
7. `supabase/migrations/007_rag_schema.sql` - Creates RAG tables
8. `supabase/migrations/008_fix_vector_dimensions.sql` - Fixes vector dimensions

### 4. Verify Tables Created

Run this query to verify:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see:
- vaults
- vault_members
- sources
- annotations
- files
- activity_logs
- chat_conversations
- chat_messages
- document_chunks

### 5. Run Seed Script

After all migrations are applied, run:

```bash
cd frontend
npm run seed
```

This will create:
- 5 demo users
- 10 vaults (various types: public, private, archived)
- 20+ sources
- 17+ annotations
- 10+ files
- Activity logs

### Demo User Credentials:

- alice@example.com / Password123!
- bob@example.com / Password123!
- charlie@example.com / Password123!
- diana@example.com / Password123!
- eve@example.com / Password123!

