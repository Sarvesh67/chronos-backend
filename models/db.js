const Sequelize = require('sequelize');

const db = {};

// The cache configuration
var Redis = require('ioredis');
db.cache = Redis;

db.Sequelize = Sequelize; // For easier querying.
// db.sequelize = sequelize; // Connections are handled in the individual db instances
db.Op = Sequelize.Op; // Very important
db.sequelize = require('../models/public/db')
db.public = require("./public/model");
 
// Define all relationships here, and not in the individual files

module.exports = db;
