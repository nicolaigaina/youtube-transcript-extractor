function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  BACKEND_URL: getEnv("BACKEND_URL", "http://localhost:5000"),
  DATABASE_URL: getEnv("DATABASE_URL", "file:./data/transcripts.db"),
};
