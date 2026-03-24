declare const process: { env: Record<string, string | undefined> }

export default {
  schema: './schema.prisma',
  database: {
    url: process.env.DATABASE_URL
  }
}