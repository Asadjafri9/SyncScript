const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: './frontend/.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

const migrations = [
  '001_init_schema.sql',
  '002_enable_rls.sql', 
  '003_performance_indexes.sql',
  '004_notifications.sql',
  '005_add_is_public.sql',
  '006_enable_pgvector.sql',
  '007_rag_schema.sql',
  '008_fix_vector_dimensions.sql'
];

async function applyMigration(filename) {
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', filename);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log(`📄 Applying ${filename}...`);
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`❌ Failed to apply ${filename}:`, error.message);
      return false;
    }
    
    console.log(`✅ Applied ${filename}`);
    return true;
  } catch (err) {
    console.error(`❌ Error applying ${filename}:`, err.message);
    return false;
  }
}

async function applyAllMigrations() {
  console.log('🚀 Applying database migrations...\n');
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (!success) {
      console.error(`❌ Migration failed: ${migration}`);
      process.exit(1);
    }
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ All migrations applied successfully!');
}

applyAllMigrations().catch(console.error);