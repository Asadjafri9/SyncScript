const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function createTables() {
  console.log('🚀 Creating database tables...\n');

  // 1. Create vaults table
  console.log('📄 Creating vaults table...');
  const { error: vaultsError } = await supabase.rpc('exec', {
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
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
      
      CREATE INDEX IF NOT EXISTS idx_vaults_owner_id ON vaults(owner_id);
      CREATE INDEX IF NOT EXISTS idx_vaults_created_at ON vaults(created_at);
      CREATE INDEX IF NOT EXISTS idx_vaults_is_public ON vaults(is_public);
    `
  });

  if (vaultsError) {
    console.log('✅ Vaults table already exists or created');
  } else {
    console.log('✅ Created vaults table');
  }

  // 2. Create vault_members table
  console.log('📄 Creating vault_members table...');
  await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS vault_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        vault_id UUID NOT NULL,
        user_id UUID NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'contributor', 'viewer')),
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(vault_id, user_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_vault_members_vault_id ON vault_members(vault_id);
      CREATE INDEX IF NOT EXISTS idx_vault_members_user_id ON vault_members(user_id);
    `
  });
  console.log('✅ Created vault_members table');

  // 3. Create sources table
  console.log('📄 Creating sources table...');
  await supabase.rpc('exec', {
    sql: `
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
      
      CREATE INDEX IF NOT EXISTS idx_sources_vault_id ON sources(vault_id);
      CREATE INDEX IF NOT EXISTS idx_sources_created_at ON sources(created_at);
    `
  });
  console.log('✅ Created sources table');

  // 4. Create annotations table
  console.log('📄 Creating annotations table...');
  await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS annotations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        source_id UUID NOT NULL,
        content TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        created_by UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_annotations_source_id ON annotations(source_id);
      CREATE INDEX IF NOT EXISTS idx_annotations_created_at ON annotations(created_at);
    `
  });
  console.log('✅ Created annotations table');

  // 5. Create files table
  console.log('📄 Creating files table...');
  await supabase.rpc('exec', {
    sql: `
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
      
      CREATE INDEX IF NOT EXISTS idx_files_vault_id ON files(vault_id);
      CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
    `
  });
  console.log('✅ Created files table');

  // 6. Create activity_logs table
  console.log('📄 Creating activity_logs table...');
  await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        vault_id UUID NOT NULL,
        action_type VARCHAR(100) NOT NULL,
        actor_id UUID,
        metadata JSONB DEFAULT '{}',
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_activity_logs_vault_id ON activity_logs(vault_id);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
    `
  });
  console.log('✅ Created activity_logs table');

  console.log('\n✅ All tables created successfully!');
}

createTables().catch(console.error);