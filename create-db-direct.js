const fetch = require('node-fetch');
require('dotenv').config({ path: './frontend/.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createTablesDirectly() {
  console.log('🚀 Creating tables via Supabase Management API...\n');

  const sql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS annotations CASCADE;
DROP TABLE IF EXISTS sources CASCADE;
DROP TABLE IF EXISTS vault_members CASCADE;
DROP TABLE IF EXISTS vaults CASCADE;

-- Create vaults table
CREATE TABLE vaults (
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
CREATE TABLE vault_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contributor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vault_id, user_id)
);

-- Create sources table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
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
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create files table
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  file_url VARCHAR(2048) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_size BIGINT,
  checksum VARCHAR(64),
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  actor_id UUID,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_vaults_owner_id ON vaults(owner_id);
CREATE INDEX idx_vaults_created_at ON vaults(created_at);
CREATE INDEX idx_vaults_is_public ON vaults(is_public);
CREATE INDEX idx_vault_members_vault_id ON vault_members(vault_id);
CREATE INDEX idx_vault_members_user_id ON vault_members(user_id);
CREATE INDEX idx_sources_vault_id ON sources(vault_id);
CREATE INDEX idx_sources_created_at ON sources(created_at);
CREATE INDEX idx_annotations_source_id ON annotations(source_id);
CREATE INDEX idx_annotations_created_at ON annotations(created_at);
CREATE INDEX idx_files_vault_id ON files(vault_id);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_activity_logs_vault_id ON activity_logs(vault_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);
`;

  try {
    // Use PostgREST query endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ PostgREST failed:', response.status, errorText);
      console.log('\n⚠️  Please manually run the SQL in Supabase Dashboard:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Click SQL Editor');
      console.log('3. Copy the SQL from SyncScript/create-db-direct.js');
      console.log('4. Run it');
      console.log('5. Then run: node force-seed.js');
      return false;
    }

    console.log('✅ Tables created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Please manually run the SQL in Supabase Dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Click SQL Editor');
    console.log('3. Copy and run this SQL:\n');
    console.log(sql);
    return false;
  }
}

createTablesDirectly().then(success => {
  if (success) {
    console.log('\n✅ Now run: node force-seed.js');
  }
  process.exit(success ? 0 : 1);
});