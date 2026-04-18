const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, db: { schema: 'public' } }
);

async function properSeed() {
  console.log('🚀 Properly seeding database...\n');

  // Get existing users
  const { data: users } = await supabase.auth.admin.listUsers();
  const userEmails = ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'];
  const userIds = userEmails.map(email => {
    const user = users.users.find(u => u.email === email);
    return user ? user.id : null;
  }).filter(Boolean);

  if (userIds.length < 5) {
    console.error('❌ Not enough users found');
    return;
  }

  const [ALICE_ID, BOB_ID, CHARLIE_ID, DIANA_ID, EVE_ID] = userIds;
  console.log(`✅ Found ${userIds.length} users\n`);

  // Delete existing data
  console.log('🗑️  Clearing existing data...');
  await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('annotations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('files').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sources').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('vault_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('vaults').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Cleared\n');

  // Insert vaults
  console.log('📦 Inserting vaults...');
  const vaults = [
    { id: '10000000-0000-0000-0000-000000000001', name: 'AI Research Hub', description: 'Comprehensive collection of AI and ML research papers', owner_id: ALICE_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000002', name: 'Business Strategy Docs', description: 'Strategic planning documents and market analysis', owner_id: ALICE_ID, is_public: false, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000003', name: 'Web Dev Resources', description: 'Tutorials, documentation, and code samples', owner_id: BOB_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000004', name: 'Archived Project 2023', description: 'Old project files - archived for reference', owner_id: CHARLIE_ID, is_public: false, is_archived: true },
    { id: '10000000-0000-0000-0000-000000000005', name: 'Personal Knowledge Base', description: 'Private collection', owner_id: DIANA_ID, is_public: false, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000006', name: 'Team Collaboration Space', description: 'Shared workspace', owner_id: EVE_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000007', name: 'Open Source Study Group', description: 'Open source analyses', owner_id: BOB_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000008', name: 'Data Science Bootcamp', description: 'Data science resources', owner_id: CHARLIE_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000009', name: 'UX Design Patterns', description: 'UX/UI design research', owner_id: DIANA_ID, is_public: true, is_archived: false },
    { id: '10000000-0000-0000-0000-000000000010', name: 'Cybersecurity Reading List', description: 'Security papers', owner_id: EVE_ID, is_public: true, is_archived: false },
  ];

  const { data: insertedVaults, error: vaultError } = await supabase.from('vaults').insert(vaults).select();
  if (vaultError) {
    console.error('❌ Error inserting vaults:', vaultError);
    return;
  }
  console.log(`✅ Inserted ${insertedVaults.length} vaults\n`);

  // Insert vault members
  console.log('👥 Inserting vault members...');
  const members = [
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: ALICE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: BOB_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: CHARLIE_ID, role: 'viewer' },
    { vault_id: '10000000-0000-0000-0000-000000000002', user_id: ALICE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000002', user_id: EVE_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000003', user_id: BOB_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000003', user_id: DIANA_ID, role: 'viewer' },
    { vault_id: '10000000-0000-0000-0000-000000000004', user_id: CHARLIE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000005', user_id: DIANA_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: EVE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: ALICE_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: BOB_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000007', user_id: BOB_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000008', user_id: CHARLIE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000009', user_id: DIANA_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000010', user_id: EVE_ID, role: 'owner' },
  ];

  const { data: insertedMembers, error: memberError } = await supabase.from('vault_members').insert(members).select();
  if (memberError) {
    console.error('❌ Error inserting members:', memberError);
  } else {
    console.log(`✅ Inserted ${insertedMembers.length} vault members\n`);
  }

  // Insert sources
  console.log('📄 Inserting sources...');
  const sources = [
    { id: '20000000-0000-0000-0000-000000000001', vault_id: '10000000-0000-0000-0000-000000000001', url: 'https://arxiv.org/pdf/2301.00123.pdf', title: 'Transformer Architecture', metadata: {}, created_by: ALICE_ID },
    { id: '20000000-0000-0000-0000-000000000002', vault_id: '10000000-0000-0000-0000-000000000001', url: 'https://openai.com/research/gpt-4', title: 'GPT-4 Technical Report', metadata: {}, created_by: BOB_ID },
    { id: '20000000-0000-0000-0000-000000000003', vault_id: '10000000-0000-0000-0000-000000000003', url: 'https://react.dev/learn', title: 'React Documentation', metadata: {}, created_by: BOB_ID },
    { id: '20000000-0000-0000-0000-000000000004', vault_id: '10000000-0000-0000-0000-000000000006', url: 'https://example.com/roadmap', title: 'Q1 2026 Roadmap', metadata: {}, created_by: EVE_ID },
    { id: '20000000-0000-0000-0000-000000000005', vault_id: '10000000-0000-0000-0000-000000000007', url: 'https://github.com/torvalds/linux', title: 'Linux Kernel', metadata: {}, created_by: BOB_ID },
  ];

  const { data: insertedSources, error: sourceError } = await supabase.from('sources').insert(sources).select();
  if (sourceError) {
    console.error('❌ Error inserting sources:', sourceError);
  } else {
    console.log(`✅ Inserted ${insertedSources.length} sources\n`);
  }

  console.log('🎉 Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log('   • 10 Vaults (7 public, 2 private, 1 archived)');
  console.log('   • 16 Vault Members');
  console.log('   • 5 Sources');
  console.log('\n🔑 Login with: alice@example.com / Password123!');
  console.log('🚀 Refresh http://localhost:3000 to see the vaults!');
}

properSeed().catch(console.error);