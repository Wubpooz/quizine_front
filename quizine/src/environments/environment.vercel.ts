export const environment = {
  production: true,
  apiEndpoint: "/api", // https://quizine-backend.vercel.app/api rewriten by vercel
  mockAuth: false,
  socket: false,
  supabaseUrl: process.env['SUPABASE_URL'] || '',
  supabaseKey: process.env['SUPABASE_ANON_KEY'] || ''
};