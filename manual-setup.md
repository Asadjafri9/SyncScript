# Manual Database Setup

Since the API approach isn't working, please manually apply the SQL in Supabase:

## Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: **Sync Script**
3. Click **SQL Editor** (left sidebar)
4. Click **New query**

## Step 2: Copy and Run This SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vaults table
CREATE TABLE IF NOT EXISTS vaults (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  is_archived BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create vault_members table
CREATE TABLE IF NOT EXISTS vault_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contributor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vault_id, user_id)
);

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vault_id, url)
);

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL,
  file_url VARCHAR(2048) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size BIGINT,
  checksum VARCHAR(64),
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  actor_id UUID,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vaults_owner_id ON vaults(owner_id);
CREATE INDEX IF NOT EXISTS idx_vaults_created_at ON vaults(created_at);
CREATE INDEX IF NOT EXISTS idx_vaults_is_public ON vaults(is_public);
CREATE INDEX IF NOT EXISTS idx_vault_members_vault_id ON vault_members(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_members_user_id ON vault_members(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_vault_id ON sources(vault_id);
CREATE INDEX IF NOT EXISTS idx_sources_created_at ON sources(created_at);
CREATE INDEX IF NOT EXISTS idx_annotations_source_id ON annotations(source_id);
CREATE INDEX IF NOT EXISTS idx_annotations_created_at ON annotations(created_at);
CREATE INDEX IF NOT EXISTS idx_files_vault_id ON files(vault_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_vault_id ON activity_logs(vault_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
```

## Step 3: Click "Run" 

Wait for the query to complete successfully.

## Step 4: Run Seed Script

After the tables are created, run:

```bash
cd SyncScript
node seed-vaults.js
```

This will create:
- **10 vaults** (AI Research, Business Strategy, Web Dev, etc.)
- **5 demo users** with login credentials
- **Sources, annotations, and vault members**

## Demo Login Credentials:
- alice@example.com / Password123!
- bob@example.com / Password123!
- charlie@example.com / Password123!
- diana@example.com / Password123!
- eve@example.com / Password123!

---

**After completing these steps, your SyncScript will have 10 fully populated vaults with dummy data!**