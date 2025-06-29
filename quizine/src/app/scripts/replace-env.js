const fs = require('fs');

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseKey = process.env["SUPABASE_ANON_KEY"];

const prodEnvPath = 'src/environments/environment.prod.ts';

let content = fs.readFileSync(prodEnvPath, 'utf8');

content = content
  .replace('SUPABASE_URL_PLACEHOLDER', `'${supabaseUrl}'`)
  .replace('SUPABASE_ANON_KEY_PLACEHOLDER', `'${supabaseKey}'`);

fs.writeFileSync(prodEnvPath, content, 'utf8');
console.log('✅ Environment variables injected into environment.prod.ts');


/*
// scripts/replace-env.js
const fs = require('fs');
const path = require('path');

const env = process.env;

const outputPath = path.join(__dirname, '../src/environments/environment.vercel.ts');

const content = `export const environment = {
  production: true,
  apiEndpoint: "/api",
  mockAuth: false,
  socket: false,
  supabaseUrl: "${env.SUPABASE_URL || ''}",
  supabaseKey: "${env.SUPABASE_ANON_KEY || ''}"
};`;

fs.writeFileSync(outputPath, content);
console.log('[Env] Vercel environment written to', outputPath);
*/