/**
 * Uncomment this in case you need to use a database
 * It's using knex query builder by default and postgres
 * More info in http://knexjs.org/
 */

// import dotenv from 'dotenv'
// import knex from 'knex'
//
// dotenv.config()
//
// const config = {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// }
//
// export const client = knex({
//   client: 'postgres',
//   connection:
//     process.env.NODE_ENV === 'development'
//       ? config
//       : {
//           connectionString: process.env.DATABASE_URL,
//           ssl: {
//             rejectUnauthorized: false,
//           },
//         },
// })
