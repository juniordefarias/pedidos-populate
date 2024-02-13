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

// category
const data = fs.readFileSync('grupo/grupo.txt', 'utf-8');

const rows = data.split('\r\n');

rows.forEach((row) => {
  const columns = row.split(',');

  client.query(`
    INSERT INTO category(
      id,
      description,
      id_section,
      excluded
    )
    VALUES($1 ,$2, $3, $4)
  `, [
    Number(columns[0]),
    columns[1]?.replace(/"/g, ''),
    Number(columns[2]),
    columns[3]?.replace(/"/g, '') === 'S' ? 'Y' : columns[3]?.replace(/"/g, ''),
  ])
    .catch(erro => {
      //console.error(erro);
      console.log({erro, columns})
    });

  /* console.log(
    Number(columns[0]),
    columns[1]?.replace(/"/g, ''),
    Number(columns[2]),
    columns[3]?.replace(/"/g, '') === 'S' ? 'Y' : columns[3]?.replace(/"/g, ''),
  ); */
});

console.log('group table is done');
