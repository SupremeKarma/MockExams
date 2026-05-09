const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../platform/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdmin() {
  const email = 'amanmahato321@gmail.com';
  const password = '123456789';

  console.log(`Setting up admin user: ${email}`);

  // 1. Check if user exists in Auth
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  let user = users.users.find(u => u.email === email);

  if (!user) {
    console.log('User not found in Auth, creating...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }
    user = newUser.user;
    console.log('User created successfully.');
  } else {
    console.log('User found in Auth, updating password and metadata...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      user_metadata: { role: 'admin' }
    });
    if (updateError) {
      console.error('Error updating auth user:', updateError);
      return;
    }
  }

  // 2. Ensure role is set in public.users
  console.log('Updating role in public.users table...');
  const { error: dbError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', email);

  if (dbError) {
    // Maybe record doesn't exist yet (if trigger failed)
    console.log('Update failed or user record missing, attempting upsert...');
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        email: email, 
        role: 'admin',
        full_name: 'Admin'
      });
    
    if (upsertError) {
      console.error('Error upserting user profile:', upsertError);
      return;
    }
  }

  console.log('Admin setup complete!');
}

setupAdmin();
