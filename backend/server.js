require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const origenesPermitidos = [
  process.env.FRONTEND_URL,
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501"
].filter(Boolean);

app.use(cors({
  origin: function (origen, callback) {
    if (!origen || origenesPermitidos.includes(origen)) {
      return callback(null, true);
    }
    return callback(new Error("Origen no permitido por CORS"));
  }
}));

// Conexión a la base de datos MySQL mediante pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Backend de consulta MySQL funcionando.");
});

// Endpoint principal: consulta con INNER JOIN entre cartas_yugioh y tipos_carta
app.get("/api/cartas", async (req, res) => {
  try {
    const consulta = `
      SELECT
          p.card_id_api AS id,
          p.nombre AS name,
          p.tipo AS type,
          p.descripcion AS \`desc\`,
          p.atributo AS attribute,
          p.nivel AS level,
          p.escala AS scale,
          p.raza AS race,
          p.atk,
          p.def,
          p.imagen_url,
          p.set_nombre,
          t.nombre AS categoria
      FROM cartas_yugioh AS p
      INNER JOIN tipos_carta AS t
          ON p.tipo_id = t.tipo_id
      ORDER BY p.nombre;
    `;

    const [filas] = await pool.query(consulta);

    const cartasFormateadas = filas.map(carta => ({
      id: carta.id,
      name: carta.name,
      type: carta.type,
      desc: carta.desc,
      attribute: carta.attribute,
      level: carta.level,
      scale: carta.scale,
      race: carta.race,
      atk: carta.atk,
      def: carta.def,
      card_images: [{ image_url: carta.imagen_url }],
      card_sets: carta.set_nombre ? [{ set_name: carta.set_nombre }] : []
    }));

    res.json({ data: cartasFormateadas });
  } catch (error) {
    console.error("Error al consultar productos:", error.message);
    res.status(500).json({ mensaje: "Error al consultar la base de datos." });
  }
});

// Endpoint secundario: consulta ordenada por set directamente desde MySQL
app.get("/api/cartas/por-set", async (req, res) => {
  try {
    const consulta = `
      SELECT
          p.card_id_api AS id,
          p.nombre AS name,
          p.tipo AS type,
          p.descripcion AS \`desc\`,
          p.atributo AS attribute,
          p.nivel AS level,
          p.escala AS scale,
          p.raza AS race,
          p.atk,
          p.def,
          p.imagen_url,
          p.set_nombre,
          t.nombre AS categoria
      FROM cartas_yugioh AS p
      INNER JOIN tipos_carta AS t
          ON p.tipo_id = t.tipo_id
      ORDER BY p.set_nombre ASC, p.nombre ASC;
    `;

    const [filas] = await pool.query(consulta);

    const cartasFormateadas = filas.map(carta => ({
      id: carta.id,
      name: carta.name,
      type: carta.type,
      desc: carta.desc,
      attribute: carta.attribute,
      level: carta.level,
      scale: carta.scale,
      race: carta.race,
      atk: carta.atk,
      def: carta.def,
      card_images: [{ image_url: carta.imagen_url }],
      card_sets: carta.set_nombre ? [{ set_name: carta.set_nombre }] : []
    }));

    res.json({ data: cartasFormateadas });
  } catch (error) {
    console.error("Error al consultar productos por set:", error.message);
    res.status(500).json({ mensaje: "Error al consultar la base de datos." });
  }
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto " + PORT);
});