CREATE DATABASE pedidos;

CREATE TABLE IF NOT EXISTS secao (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL,
  eliminado CHAR(1) CHECK (eliminado IN ('S', 'N')) NOT NULL DEFAULT 'N'
);

CREATE TABLE IF NOT EXISTS grupo (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL,
  id_secao INTEGER,
  cancelado CHAR(1) CHECK (cancelado IN ('S', 'N')) NOT NULL DEFAULT 'N',
  FOREIGN KEY(id_secao) REFERENCES secao(id)
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  codigo VARCHAR(14) NOT NULL,
  preco_compra NUMERIC(10, 3) NOT NULL DEFAULT 0,
  preco_venda NUMERIC(10, 3) NOT NULL DEFAULT 0,
  estoque NUMERIC(10, 3) NOT NULL DEFAULT 0,
  unidade VARCHAR(2) CHECK (unidade IN ('UN', 'KG')) NOT NULL,
  id_grupo INTEGER,
  eliminado CHAR(1) CHECK (eliminado IN ('S', 'N')) NOT NULL DEFAULT 'N',
  FOREIGN KEY(id_grupo) REFERENCES grupo(id)
);

CREATE TABLE IF NOT EXISTS pessoa (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  phone VARCHAR(11),
  email VARCHAR(50),
  cancelado CHAR(1) CHECK (cancelado IN ('S', 'N')) NOT NULL DEFAULT 'N'
);

CREATE TABLE IF NOT EXISTS produto_fornecedor (
  id SERIAL PRIMARY KEY,
  id_produto INTEGER NOT NULL,
  id_pessoa INTEGER NOT NULL,
  referencia VARCHAR NOT NULL,
  preco_compra NUMERIC(10, 3),
  multiplicador NUMERIC(10, 3) NOT NULL DEFAULT 0 ,
  divisor NUMERIC(10, 3) NOT NULL DEFAULT 0,
  FOREIGN KEY(id_produto) REFERENCES produtos(id),
  FOREIGN KEY(id_pessoa) REFERENCES pessoa(id)
);

CREATE TABLE IF NOT EXISTS request (
  id SERIAL PRIMARY KEY,
  status CHAR(1) CHECK (status IN ('W', 'R', 'D')) NOT NULL DEFAULT 'W',
  id_provider INTEGER NOT NULL,
  id_buyer INTEGER NOT NULL,
  date_request date NOT NULL DEFAULT CURRENT_DATE,
  date_forecast date,
  date_receiving date,
  posted CHAR(1) CHECK (posted IN ('Y', 'N')) NOT NULL DEFAULT 'N',
  excluded CHAR(1) CHECK (excluded IN ('Y', 'N')) NOT NULL DEFAULT 'N',
  FOREIGN KEY(id_provider) REFERENCES pessoa(id)
);

CREATE TABLE IF NOT EXISTS request_product (
  id SERIAL PRIMARY KEY,
  id_request INTEGER NOT NULL,
  id_product INTEGER NOT NULL,
  quantity NUMERIC(10, 3) NOT NULL,
  bonus NUMERIC(10, 3),
  purchase_price NUMERIC(10, 3) NOT NULL,
  sale_price NUMERIC(10, 3),
  discount_price NUMERIC(10, 3),
  reference VARCHAR NOT NULL,
  multiplier NUMERIC(10, 3) NOT NULL DEFAULT 1,
  excluded CHAR(1) CHECK (excluded IN ('Y', 'N')) NOT NULL DEFAULT 'N',
  FOREIGN KEY(id_request) REFERENCES request(id),
  FOREIGN KEY(id_product) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  excluded CHAR(1) CHECK (excluded IN ('Y', 'N')) NOT NULL DEFAULT 'N'
);
