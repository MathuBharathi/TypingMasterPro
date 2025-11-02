import { neon } from '@neondatabase/serverless';

export const handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Example query
    const users = await sql`SELECT * FROM users`;

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
