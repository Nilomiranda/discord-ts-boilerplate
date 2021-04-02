import dotenv from 'dotenv'
import knex from 'knex'

dotenv.config()

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
}

export const client = knex({
  client: 'postgres',
  connection: process.env.NODE_ENV === 'development' ? config : process.env.DATABASE_URL,
})
