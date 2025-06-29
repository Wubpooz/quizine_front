import * as fs from 'fs';

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_ANON_KEY"];

const prodEnvPath = 'src/environments/environment.prod.ts';

let content = fs.readFileSync(prodEnvPath, 'utf8');

content = content
  .replace('SUPABASE_URL_PLACEHOLDER', `'${supabaseUrl}'`)
  .replace('SUPABASE_ANON_KEY_PLACEHOLDER', `'${supabaseKey}'`);

fs.writeFileSync(prodEnvPath, content, 'utf8');
console.log('✅ Environment variables injected into environment.prod.ts');
