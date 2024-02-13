const dotenv = require('dotenv');

dotenv.config();

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

client.connect();

const fs = require('fs');

// provider
const data = fs.readFileSync('pessoa/pessoa.csv', 'utf-8');

const rows = data.split('\n');

rows.forEach((row) => {
  const columns = row.split(',');

  client.query(`
    INSERT INTO provider(
      id,
      name,
      cnpj,
      phone,
      email,
      excluded
    )
    VALUES($1 ,$2, $3, $4, $5, $6)
    `, [
    Number(columns[0]),
    columns[1]?.replace(/"/g, ''),
    columns[2]?.replace(/"/g, ''),
    columns[3]?.replace(/"/g, '').substring(0, 11),
    columns[4]?.replace(/"/g, ''),
    columns[5]?.replace(/"/g, '') === 'S' ? 'Y' : columns[5]?.replace(/"/g, '')
  ])
    .catch(erro => {
      //console.error(erro);
      console.log({erro, columns})
    });

  /* const column2 = columns[2]?.replace(/"/g, '');
  if (column2.length > 14) {
    console.log(columns[2]);
  } */

  /* console.log(
    Number(columns[0]),
    columns[1]?.replace(/"/g, ''),
    columns[2]?.replace(/"/g, ''),
    columns[3]?.replace(/"/g, '').substring(0, 11),
    columns[4]?.replace(/"/g, ''),
  ); */
});

console.log('people table is done');
