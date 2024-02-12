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

// relations
const data = fs.readFileSync('produtos/produtos.csv', 'utf-8');

const rows = data.split('\n');
rows.forEach((row) => {
  const columns = row.split(';');

  client.query(`
    INSERT INTO produtos----(
      id,
      nome,
      codigo,
      preco_compra,
      preco_venda,
      estoque,
      unidade,
      id_grupo,
      eliminado
    )
    VALUES($1 ,$2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    Number(columns[0]),
    columns[1],
    columns[2],
    Number(columns[3]),
    Number(columns[4]),
    Number(columns[5]),
    !columns[6] ? 'UN' : columns[6], //corrigir os registros que veem sem valor de unidade
    Number(columns[7]),
    columns[8],
  ])
    .catch(erro => {
      //console.error(erro);
      console.log({erro, row})
    });

  /* console.log(
    Number(columns[0]),
    columns[1],
    columns[2],
    Number(columns[3]),
    Number(columns[4]),
    Number(columns[5]),
    !columns[6] ? 'UN' : 'KG',
    Number(columns[7]),
    columns[8],
  ); */

  /* if (columns[6] !== 'UN' && columns[6] !== 'KG') {
    console.log(columns[0], columns[1], columns[6]);
  } */
});

console.log('products table is done');
