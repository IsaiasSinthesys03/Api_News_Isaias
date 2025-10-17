// config.db.js (Versión Final para Render/Postgres)
const Sequelize = require('sequelize');
require('dotenv').config();

// Buscamos la URL de conexión única en las variables de entorno
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("postgresql://db_news_y4gb_user:FripLbBVYpVKTV08pK71dgWeAgq5c0HK@dpg-d3p0u1t6ubrc73aljse0-a.oregon-postgres.render.com/db_news_y4gb");
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