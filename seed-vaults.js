const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function seedVaults() {
  console.log('🌱 Seeding 10 vaults with dummy data...\n');

  // Get existing users
  const { data: users } = await supabase.auth.admin.listUsers();
  const userEmails = ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'diana@example.com', 'eve@example.com'];
  const userIds = userEmails.map(email => {
    const user = users.users.find(u => u.email === email);
    return user ? user.id : null;
  }).filter(Boolean);

  if (userIds.length < 5) {
    console.error('❌ Not enough users found. Please create users first.');
    return;
  }

  const [ALICE_ID, BOB_ID, CHARLIE_ID, DIANA_ID, EVE_ID] = userIds;

  // Create 10 vaults
  const vaults = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'AI Research Hub',
      description: 'Comprehensive collection of AI and ML research papers',
      owner_id: ALICE_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Business Strategy Docs',
      description: 'Strategic planning documents and market analysis',
      owner_id: ALICE_ID,
      is_public: false,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Web Dev Resources',
      description: 'Tutorials, documentation, and code samples',
      owner_id: BOB_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      name: 'Archived Project 2023',
      description: 'Old project files - archived for reference',
      owner_id: CHARLIE_ID,
      is_archived: true,
      is_public: false,
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      name: 'Personal Knowledge Base',
      description: 'Private collection with no additional members',
      owner_id: DIANA_ID,
      is_public: false,
    },
    {
      id: '10000000-0000-0000-0000-000000000006',
      name: 'Team Collaboration Space',
      description: 'Shared workspace for the entire team',
      owner_id: EVE_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000007',
      name: 'Open Source Study Group',
      description: 'Community-driven collection of open source project analyses',
      owner_id: BOB_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000008',
      name: 'Data Science Bootcamp',
      description: 'Curated resources for learning data science',
      owner_id: CHARLIE_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000009',
      name: 'UX Design Patterns',
      description: 'Research papers and case studies on modern UX/UI design',
      owner_id: DIANA_ID,
      is_public: true,
    },
    {
      id: '10000000-0000-0000-0000-000000000010',
      name: 'Cybersecurity Reading List',
      description: 'Essential papers on network security and cryptography',
      owner_id: EVE_ID,
      is_public: true,
    },
  ];

  console.log('📦 Creating vaults...');
  for (const vault of vaults) {
    try {
      const { error } = await supabase
        .from('vaults')
        .upsert(vault);
      
      if (error) {
        console.error(`❌ Error creating vault "${vault.name}":`, error.message);
      } else {
        console.log(`✅ Created vault: ${vault.name}`);
      }
    } catch (err) {
      console.error(`❌ Exception creating vault "${vault.name}":`, err.message);
    }
  }

  // Create vault members
  console.log('\n👥 Adding vault members...');
  const members = [
    // AI Research Hub - Multiple members
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: ALICE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: BOB_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000001', user_id: CHARLIE_ID, role: 'viewer' },
    
    // Business Strategy - Owner + contributor
    { vault_id: '10000000-0000-0000-0000-000000000002', user_id: ALICE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000002', user_id: EVE_ID, role: 'contributor' },
    
    // Web Dev - Owner + viewer
    { vault_id: '10000000-0000-0000-0000-000000000003', user_id: BOB_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000003', user_id: DIANA_ID, role: 'viewer' },
    
    // Archived - Owner only
    { vault_id: '10000000-0000-0000-0000-000000000004', user_id: CHARLIE_ID, role: 'owner' },
    
    // Personal - Owner only
    { vault_id: '10000000-0000-0000-0000-000000000005', user_id: DIANA_ID, role: 'owner' },
    
    // Team Collaboration - All users
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: EVE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: ALICE_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: BOB_ID, role: 'contributor' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: CHARLIE_ID, role: 'viewer' },
    { vault_id: '10000000-0000-0000-0000-000000000006', user_id: DIANA_ID, role: 'viewer' },

    // Public vaults
    { vault_id: '10000000-0000-0000-0000-000000000007', user_id: BOB_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000007', user_id: ALICE_ID, role: 'contributor' },
    
    { vault_id: '10000000-0000-0000-0000-000000000008', user_id: CHARLIE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000008', user_id: EVE_ID, role: 'viewer' },
    
    { vault_id: '10000000-0000-0000-0000-000000000009', user_id: DIANA_ID, role: 'owner' },
    
    { vault_id: '10000000-0000-0000-0000-000000000010', user_id: EVE_ID, role: 'owner' },
    { vault_id: '10000000-0000-0000-0000-000000000010', user_id: BOB_ID, role: 'contributor' },
  ];

  for (const member of members) {
    try {
      const { error } = await supabase
        .from('vault_members')
        .upsert(member);
      
      if (error) {
        console.error(`❌ Error adding member:`, error.message);
      } else {
        console.log(`✅ Added member to vault ${member.vault_id.slice(-1)}`);
      }
    } catch (err) {
      console.error(`❌ Exception adding member:`, err.message);
    }
  }

  // Create some sources
  console.log('\n📄 Adding sources...');
  const sources = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      vault_id: '10000000-0000-0000-0000-000000000001',
      url: 'https://arxiv.org/pdf/2301.00123.pdf',
      title: 'Attention Is All You Need - Transformer Architecture',
      metadata: { type: 'pdf', pages: 15, year: 2017 },
      created_by: ALICE_ID,
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      vault_id: '10000000-0000-0000-0000-000000000001',
      url: 'https://openai.com/research/gpt-4',
      title: 'GPT-4 Technical Report',
      metadata: { type: 'article', word_count: 8000 },
      created_by: BOB_ID,
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      vault_id: '10000000-0000-0000-0000-000000000003',
      url: 'https://react.dev/learn',
      title: 'Official React Documentation',
      metadata: { type: 'documentation', version: '18.2' },
      created_by: BOB_ID,
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      vault_id: '10000000-0000-0000-0000-000000000006',
      url: 'https://confluence.company.com/project-plan',
      title: 'Q1 2026 Project Roadmap',
      metadata: { type: 'wiki', last_updated: '2026-01-15' },
      created_by: EVE_ID,
    },
    {
      id: '20000000-0000-0000-0000-000000000005',
      vault_id: '10000000-0000-0000-0000-000000000007',
      url: 'https://github.com/torvalds/linux',
      title: 'Linux Kernel - Architecture Overview',
      metadata: { type: 'code', stars: 170000 },
      created_by: BOB_ID,
    },
  ];

  for (const source of sources) {
    try {
      const { error } = await supabase
        .from('sources')
        .upsert(source);
      
      if (error) {
        console.error(`❌ Error creating source "${source.title}":`, error.message);
      } else {
        console.log(`✅ Created source: ${source.title}`);
      }
    } catch (err) {
      console.error(`❌ Exception creating source "${source.title}":`, err.message);
    }
  }

  // Create some annotations
  console.log('\n💬 Adding annotations...');
  const annotations = [
    {
      source_id: '20000000-0000-0000-0000-000000000001',
      content: 'Section 3.1 explains multi-head attention mechanism. Critical for understanding transformers!',
      created_by: ALICE_ID,
    },
    {
      source_id: '20000000-0000-0000-0000-000000000001',
      content: 'The positional encoding formula is on page 6. Need to review this for implementation.',
      created_by: BOB_ID,
    },
    {
      source_id: '20000000-0000-0000-0000-000000000003',
      content: 'The hooks section is particularly well-explained. Bookmark for team training.',
      created_by: BOB_ID,
    },
    {
      source_id: '20000000-0000-0000-0000-000000000004',
      content: 'Q1 priorities look good, but we should add buffer time for testing phase.',
      created_by: ALICE_ID,
    },
    {
      source_id: '20000000-0000-0000-0000-000000000005',
      content: 'The kernel module system is a great example of plugin architecture.',
      created_by: BOB_ID,
    },
  ];

  for (const annotation of annotations) {
    try {
      const { error } = await supabase
        .from('annotations')
        .insert(annotation);
      
      if (error) {
        console.error(`❌ Error creating annotation:`, error.message);
      } else {
        console.log(`✅ Created annotation`);
      }
    } catch (err) {
      console.error(`❌ Exception creating annotation:`, err.message);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('   • 5 Demo Users');
  console.log('   • 10 Vaults (public, private, archived)');
  console.log('   • 22 Vault Members');
  console.log('   • 5 Sources');
  console.log('   • 5 Annotations');
  
  console.log('\n🔑 Demo User Credentials:');
  console.log('   • alice@example.com / Password123!');
  console.log('   • bob@example.com / Password123!');
  console.log('   • charlie@example.com / Password123!');
  console.log('   • diana@example.com / Password123!');
  console.log('   • eve@example.com / Password123!');
}

seedVaults().catch(console.error);