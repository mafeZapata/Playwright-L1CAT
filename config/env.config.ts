export const envConfig = {
  baseUrl: process.env.BASE_URL || 'https://automationexercise.com',
  timeout: Number(process.env.TIMEOUT) || 30_000,
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 10_000,
  retries: Number(process.env.RETRIES) || 1,
};
