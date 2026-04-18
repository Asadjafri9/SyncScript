const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function forceSeed() {
  console.log('🚀 Force seeding database with raw SQL...\n');

  // Get existing users first
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
  console.log(`✅ Found ${userIds.length} users`);

  // Insert vaults using raw SQL
  console.log('📦 Inserting vaults...');
  const vaultSQL = `
    INSERT INTO vaults (id, name, description, owner_id, is_public, is_archived) VALUES
    ('10000000-0000-0000-0000-000000000001', 'AI Research Hub', 'Comprehensive collection of AI and ML research papers', '${ALICE_ID}', true, false),
    ('10000000-0000-0000-0000-000000000002', 'Business Strategy Docs', 'Strategic planning documents and market analysis', '${ALICE_ID}', false, false),
    ('10000000-0000-0000-0000-000000000003', 'Web Dev Resources', 'Tutorials, documentation, and code samples', '${BOB_ID}', true, false),
    ('10000000-0000-0000-0000-000000000004', 'Archived Project 2023', 'Old project files - archived for reference', '${CHARLIE_ID}', false, true),
    ('10000000-0000-0000-0000-000000000005', 'Personal Knowledge Base', 'Private collection with no additional members', '${DIANA_ID}', false, false),
    ('10000000-0000-0000-0000-000000000006', 'Team Collaboration Space', 'Shared workspace for the entire team', '${EVE_ID}', true, false),
    ('10000000-0000-0000-0000-000000000007', 'Open Source Study Group', 'Community-driven collection of open source project analyses', '${BOB_ID}', true, false),
    ('10000000-0000-0000-0000-000000000008', 'Data Science Bootcamp', 'Curated resources for learning data science', '${CHARLIE_ID}', true, false),
    ('10000000-0000-0000-0000-000000000009', 'UX Design Patterns', 'Research papers and case studies on modern UX/UI design', '${DIANA_ID}', true, false),
    ('10000000-0000-0000-0000-000000000010', 'Cybersecurity Reading List', 'Essential papers on network security and cryptography', '${EVE_ID}', true, false)
    ON CONFLICT (id) DO NOTHING;
  `;

  try {
    await supabase.rpc('exec', { sql: vaultSQL });
    console.log('✅ Inserted 10 vaults');
  } catch (err) {
    console.error('❌ Error inserting vaults:', err.message);
  }

  // Insert vault members
  console.log('👥 Inserting vault members...');
  const membersSQL = `
    INSERT INTO vault_members (vault_id, user_id, role) VALUES
    ('10000000-0000-0000-0000-000000000001', '${ALICE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000001', '${BOB_ID}', 'contributor'),
    ('10000000-0000-0000-0000-000000000001', '${CHARLIE_ID}', 'viewer'),
    ('10000000-0000-0000-0000-000000000002', '${ALICE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000002', '${EVE_ID}', 'contributor'),
    ('10000000-0000-0000-0000-000000000003', '${BOB_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000003', '${DIANA_ID}', 'viewer'),
    ('10000000-0000-0000-0000-000000000004', '${CHARLIE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000005', '${DIANA_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000006', '${EVE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000006', '${ALICE_ID}', 'contributor'),
    ('10000000-0000-0000-0000-000000000006', '${BOB_ID}', 'contributor'),
    ('10000000-0000-0000-0000-000000000006', '${CHARLIE_ID}', 'viewer'),
    ('10000000-0000-0000-0000-000000000006', '${DIANA_ID}', 'viewer'),
    ('10000000-0000-0000-0000-000000000007', '${BOB_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000007', '${ALICE_ID}', 'contributor'),
    ('10000000-0000-0000-0000-000000000008', '${CHARLIE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000008', '${EVE_ID}', 'viewer'),
    ('10000000-0000-0000-0000-000000000009', '${DIANA_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000010', '${EVE_ID}', 'owner'),
    ('10000000-0000-0000-0000-000000000010', '${BOB_ID}', 'contributor')
    ON CONFLICT (vault_id, user_id) DO NOTHING;
  `;

  try {
    await supabase.rpc('exec', { sql: membersSQL });
    console.log('✅ Inserted 21 vault members');
  } catch (err) {
    console.error('❌ Error inserting members:', err.message);
  }

  // Insert sources
  console.log('📄 Inserting sources...');
  const sourcesSQL = `
    INSERT INTO sources (id, vault_id, url, title, metadata, created_by) VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'https://arxiv.org/pdf/2301.00123.pdf', 'Attention Is All You Need - Transformer Architecture', '{"type": "pdf", "pages": 15, "year": 2017}', '${ALICE_ID}'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'https://openai.com/research/gpt-4', 'GPT-4 Technical Report', '{"type": "article", "word_count": 8000}', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'https://react.dev/learn', 'Official React Documentation', '{"type": "documentation", "version": "18.2"}', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', 'https://confluence.company.com/project-plan', 'Q1 2026 Project Roadmap', '{"type": "wiki", "last_updated": "2026-01-15"}', '${EVE_ID}'),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007', 'https://github.com/torvalds/linux', 'Linux Kernel - Architecture Overview', '{"type": "code", "stars": 170000}', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000008', 'https://www.kaggle.com/learn/intro-to-machine-learning', 'Kaggle - Intro to Machine Learning', '{"type": "course", "lessons": 7}', '${CHARLIE_ID}'),
    ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000009', 'https://www.nngroup.com/articles/ten-usability-heuristics/', 'Nielsen''s 10 Usability Heuristics', '{"type": "article", "word_count": 4200}', '${DIANA_ID}'),
    ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000010', 'https://owasp.org/www-project-top-ten/', 'OWASP Top 10 Web Application Security Risks', '{"type": "reference", "category": "web-security"}', '${EVE_ID}')
    ON CONFLICT (id) DO NOTHING;
  `;

  try {
    await supabase.rpc('exec', { sql: sourcesSQL });
    console.log('✅ Inserted 8 sources');
  } catch (err) {
    console.error('❌ Error inserting sources:', err.message);
  }

  // Insert annotations
  console.log('💬 Inserting annotations...');
  const annotationsSQL = `
    INSERT INTO annotations (source_id, content, created_by) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Section 3.1 explains multi-head attention mechanism. Critical for understanding transformers!', '${ALICE_ID}'),
    ('20000000-0000-0000-0000-000000000001', 'The positional encoding formula is on page 6. Need to review this for implementation.', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000002', 'Comprehensive analysis of GPT-4 capabilities. Key improvements over GPT-3.5 include better reasoning and reduced hallucinations.', '${ALICE_ID}'),
    ('20000000-0000-0000-0000-000000000003', 'The hooks section is particularly well-explained. Bookmark for team training.', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000004', 'Q1 priorities look good, but we should add buffer time for testing phase.', '${ALICE_ID}'),
    ('20000000-0000-0000-0000-000000000005', 'The kernel module system is a great example of plugin architecture. Worth studying for our own projects.', '${BOB_ID}'),
    ('20000000-0000-0000-0000-000000000006', 'Great starting point for beginners. The decision tree section is especially clear.', '${CHARLIE_ID}'),
    ('20000000-0000-0000-0000-000000000007', 'Heuristic #1 (Visibility of System Status) applies directly to our loading states.', '${DIANA_ID}'),
    ('20000000-0000-0000-0000-000000000008', 'Injection attacks are still #1 in 2025. We need to audit all our API endpoints.', '${EVE_ID}')
    ON CONFLICT DO NOTHING;
  `;

  try {
    await supabase.rpc('exec', { sql: annotationsSQL });
    console.log('✅ Inserted 9 annotations');
  } catch (err) {
    console.error('❌ Error inserting annotations:', err.message);
  }

  // Insert activity logs
  console.log('📊 Inserting activity logs...');
  const activitySQL = `
    INSERT INTO activity_logs (vault_id, action_type, actor_id, metadata) VALUES
    ('10000000-0000-0000-0000-000000000001', 'vault_created', '${ALICE_ID}', '{"vault_name": "AI Research Hub"}'),
    ('10000000-0000-0000-0000-000000000001', 'member_added', '${ALICE_ID}', '{"added_user": "Bob Smith", "role": "contributor"}'),
    ('10000000-0000-0000-0000-000000000001', 'source_added', '${ALICE_ID}', '{"source_title": "Transformer Architecture"}'),
    ('10000000-0000-0000-0000-000000000003', 'vault_created', '${BOB_ID}', '{"vault_name": "Web Dev Resources"}'),
    ('10000000-0000-0000-0000-000000000006', 'vault_created', '${EVE_ID}', '{"vault_name": "Team Collaboration Space"}'),
    ('10000000-0000-0000-0000-000000000006', 'member_added', '${EVE_ID}', '{"added_user": "Alice Johnson", "role": "contributor"}'),
    ('10000000-0000-0000-0000-000000000007', 'vault_created', '${BOB_ID}', '{"vault_name": "Open Source Study Group"}'),
    ('10000000-0000-0000-0000-000000000008', 'vault_created', '${CHARLIE_ID}', '{"vault_name": "Data Science Bootcamp"}'),
    ('10000000-0000-0000-0000-000000000009', 'vault_created', '${DIANA_ID}', '{"vault_name": "UX Design Patterns"}'),
    ('10000000-0000-0000-0000-000000000010', 'vault_created', '${EVE_ID}', '{"vault_name": "Cybersecurity Reading List"}')
    ON CONFLICT DO NOTHING;
  `;

  try {
    await supabase.rpc('exec', { sql: activitySQL });
    console.log('✅ Inserted 10 activity logs');
  } catch (err) {
    console.error('❌ Error inserting activity logs:', err.message);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('   • 5 Demo Users');
  console.log('   • 10 Vaults (public, private, archived)');
  console.log('   • 21 Vault Members');
  console.log('   • 8 Sources');
  console.log('   • 9 Annotations');
  console.log('   • 10 Activity Logs');
  
  console.log('\n🔑 Demo User Credentials:');
  console.log('   • alice@example.com / Password123!');
  console.log('   • bob@example.com / Password123!');
  console.log('   • charlie@example.com / Password123!');
  console.log('   • diana@example.com / Password123!');
  console.log('   • eve@example.com / Password123!');
  
  console.log('\n🚀 Your SyncScript now has 10 fully populated vaults!');
  console.log('   Go to http://localhost:3000 and login with any of the demo accounts.');
}

forceSeed().catch(console.error);