var Sequelize = require('sequelize');

const config = require('./config.js');

let conf = config.load();


const log = require('./logging.js').getLogger('main')
// input database, username and password vars in resp. places

var connection = new Sequelize(conf.timescaledb.database, conf.timescaledb.username, conf.timescaledb.password, {
host: conf.timescaledb.host,
port: conf.timescaledb.port,
dialect: "postgres",
});

// Model for OPC UA database values
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

)



async function start () {

  try {
  await connection.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

}




async function write (points) {
  let pts = points.map((p) => {
    let tags = p.tags || {}


    connection.sync().then(function() {
      try {
        value1.create({
          if p.value == "true" {
            value: 1
          }else if (p.value = "false") {
            value: 0
          }
          else {
            value: p.value,
          }

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

module.exports = { start, write }
