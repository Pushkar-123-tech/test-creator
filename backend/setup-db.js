import supabase from './config/supabaseClient.js';

async function checkTableExists(tableName) {
  try {
    const { error } = await supabase.from(tableName).select('*').limit(1);
    return !error;
  } catch (error) {
    return false;
  }
}

async function setupDatabase() {
  try {
    console.log('🔍 Checking database tables...\n');

    const tables = ['users', 'test_cases', 'code_analysis', 'chat_history', 'generations'];
    const missingTables = [];

    for (const table of tables) {
      const exists = await checkTableExists(table);
      if (exists) {
        console.log(`✅ ${table} table exists`);
      } else {
        console.log(`❌ ${table} table missing`);
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log('\n📋 Missing tables detected!');
      console.log('Please run these SQL commands in your Supabase SQL Editor:\n');

      console.log('```sql');
      console.log('-- Test Cases Table');
      console.log('CREATE TABLE IF NOT EXISTS test_cases (');
      console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),');
      console.log('  code TEXT NOT NULL,');
      console.log('  test_type VARCHAR(50),');
      console.log('  generated_tests JSONB,');
      console.log('  user_id UUID,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('');

      console.log('-- Code Analysis Table');
      console.log('CREATE TABLE IF NOT EXISTS code_analysis (');
      console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),');
      console.log('  code TEXT NOT NULL,');
      console.log('  analysis_result JSONB,');
      console.log('  score INTEGER,');
      console.log('  user_id UUID,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('');

      console.log('-- Chat History Table');
      console.log('CREATE TABLE IF NOT EXISTS chat_history (');
      console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),');
      console.log('  message TEXT NOT NULL,');
      console.log('  response TEXT NOT NULL,');
      console.log('  code_context TEXT,');
      console.log('  user_id UUID,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('');

      console.log('-- Users Table');
      console.log('CREATE TABLE IF NOT EXISTS users (');
      console.log('  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),');
      console.log('  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,');
      console.log('  email VARCHAR(255) UNIQUE NOT NULL,');
      console.log('  full_name VARCHAR(255),');
      console.log('  avatar_url TEXT,');
      console.log('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,');
      console.log('  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log(');');
      console.log('');
      console.log('```');

      console.log('\n📍 Go to: https://supabase.com/dashboard/project/[your-project-id]/sql');
      console.log('📍 Replace [your-project-id] with your actual project ID');
      console.log('📍 Run the SQL commands above in the SQL Editor');

    } else {
      console.log('\n🎉 All database tables are set up correctly!');
      console.log('Your application should work properly now.');
    }

    // Check user registrations
    console.log('\n👥 Checking user registrations...');
    try {
      // We can't directly query auth.users, but we can check if auth is working
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log('❌ Auth check failed:', error.message);
      } else {
        console.log('✅ Supabase Auth is configured correctly');
        console.log('📍 View registered users at: https://supabase.com/dashboard/project/[your-project-id]/auth/users');
      }
    } catch (error) {
      console.log('❌ Auth check error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

setupDatabase();