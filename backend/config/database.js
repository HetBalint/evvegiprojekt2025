const { Sequelize } = require('sequelize');

// Adatbázis konfiguráció
const sequelize = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'evvegiprojekt2025'

});

module.exports = sequelize;


