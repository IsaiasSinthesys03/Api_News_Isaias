// config.db.js (Versión Final para Render/Postgres)
const Sequelize = require('sequelize');
require('dotenv').config();

// Buscamos la URL de conexión única en las variables de entorno
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("postgresql://db_news_01_user:ZQSZNIyq2TsbAQXkva47nO9ybKtK8NkV@dpg-d3p746p5pdvs73aeao2g-a.oregon-postgres.render.com/db_news_01");
}

const connection = new Sequelize(dbUrl, {
  dialect: 'postgres', // Cambiamos el dialecto a postgres
  // Esta parte es MUY IMPORTANTE para la conexión segura en Render
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requerido por la configuración de SSL de Render
    }
  }
});

module.exports = { connection };