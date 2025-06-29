const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../environments/environment.vercel.ts');

let content = fs.readFileSync(filePath, 'utf8');

const supabaseUrl = process.env['SUPABASE_URL'] || '';
const supabaseKey = process.env['SUPABASE_ANON_KEY'] || '';

content = content
  .replace('SUPABASE_URL_PLACEHOLDER', supabaseUrl)
  .replace('SUPABASE_ANON_KEY_PLACEHOLDER', supabaseKey);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Injected Vercel env vars into environment.vercel.ts.');
