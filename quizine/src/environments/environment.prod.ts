export const environment = {
  production: true,
  apiEndpoint: "/api", // https://quizine-backend.vercel.app/api rewriten by vercel
  mockAuth: false,
  socket: !(process.env['VERCEL'] === 'true') // add Vercel env var = true to use Realtime
};