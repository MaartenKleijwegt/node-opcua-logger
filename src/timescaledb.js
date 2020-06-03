var Sequelize = require('sequelize');

const config = require('./config.js');

let conf = config.load();


const log = require('./logging.js').getLogger('main')
// input database, username and password vars in resp. place
// --> geautomatiseerd d.m.v. config file! Zie config.toml

var connection = new Sequelize(conf.timescaledb.database, conf.timescaledb.username, conf.timescaledb.password, {
host: conf.timescaledb.host,
port: conf.timescaledb.port,
dialect: "postgres",
});

// Model for OPC UA database values
// Gebaseerd op Sequelize
// Code bouwt een tabel met de juiste columns
var value1 = connection.define('values', {
  timestamp:{
    type: Sequelize.DATE,
    allowNull: false,
  },
  variable_name:{
    type: Sequelize.TEXT,
    allowNull: false
  },
  status:{
    type: Sequelize.TEXT,
    allowNull: false
  },
  value:{
    type: Sequelize.REAL,
    allowNull: false
  },
  location:{
    type: Sequelize.TEXT,
    allowNull: false
  },
}, {
    timestamps: false,
    freezeTableName: true
  }

);

// Functie die bij de opstart controleert of de database bereikbaar is
async function start () {

  try {
  await connection.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

}




// Functie die dient voor het schrijven van de eerder gedefinieerde tabel-velden naar de database.
// Genereert ook nieuwe tabel indien nog niet aanwezig.
// Future Async Promise: loopt asyncroon van de rest: kan schrijven wanneer nodig.
// Krijgt waardes wanneer deze beschikbaar zijn.
// Schrijft deze waardes vervolgens weg.

//TODO naam veranderen: value1 --> iets zinvollers

async function write (points) {
  let pts = points.map((p) => {
    let tags = p.tags || {}


    connection.sync().then(function() {
      try {
        value1.create({
          value: (p.value == true)  ? 1 : (p.value == false) ? 0 : p.value,

          variable_name: p.metric.name,
          status: p.status,

          timestamp: p.timestamp,
          location: p.metric.location,
        })
        return value1
      } catch (e) {
        log.error("Fout: ", e);
      }

  })
  })
}

// Exporteert de start en write functies zodat deze kunnen worden gebruikt in andere delen van de code.

module.exports = { start, write }
