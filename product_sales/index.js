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
const data = fs.readFileSync('product_sales/product_sales.csv', 'utf-8');

const rows = data.split('\n');

rows.forEach((row) => {
  const columns = row.split(',');

  client.query(`
    INSERT INTO product_sales(
      id_product,
      value_sold,
      quantity_sold,
      daily_quantity,
      part_value,
      part_quantity
    )
    VALUES($1, $2, $3, $4, $5, $6)
  `, [
    Number(columns[0]),
    Number(columns[1]),
    columns[2]?.replace(/"/g, ''),
    columns[3]?.replace(/"/g, ''),
    columns[4]?.replace(/"/g, ''),
    columns[5]?.replace(/"/g, ''),
  ]) 
    .catch(erro => {
      //console.error(erro);
      console.log({erro, columns})
    });

  /* console.log(
    Number(columns[0]),
    Number(columns[1]),
    Number(columns[2]),
    columns[3]?.replace(/"/g, ''),
    Number(columns[4]?.replace(/"/g, '')),
    columns[5]?.replace(/"/g, ''),
    columns[6]?.replace(/"/g, ''),
  ); */
});

console.log('product_provider table is done');
