var mysql = require('mysql');

var fs = require('fs');
var topLevelModule = module;
while (topLevelModule.parent) topLevelModule = topLevelModule.parent;
var path = topLevelModule.filename.split('/');
path.pop();
var projectName = path.pop();
if (process.env.NODE_ENV != 'local' && process.env.NODE_ENV != 'development') projectName = path.pop();


var database = { };
module.exports = database;

database.useCache = function(cache) {
  this._cache = cache;
};

database.configureWith = function(config) {
  this._pool = mysql.createPool({
    host: config.host,
    database: config.database || '',
    user: config.username,
    password: config.password,
    connectionLimit: config.connectionLimit || 40,
    timezone: config.timezone || '',
    createConnection: function(options) {
      var connection = mysql.createConnection(options);

      connection.on('error', function(err){
        connection.destroy();
      });

      return connection;
    }
  });
};

database.query = function(options, callback) {
  var self = this;
  if (!self._pool) throw new Error('Database hasnt been configured yet!');

  var stack = 'unknown';
  try {
    stack = new Error().stack.split('\n')[2].split(' (')[1].slice(0,-1);
  } catch(e) { }

  self._checkGetCache(options, callback, function() {
    self._pool.getConnection(function(err, client) {
      if(err) return callback(err);

      options.sql = ('/* '+projectName+': '+stack+' */ ') + options.sql;
      client.query(options.sql, options.values, function(err, results) {
        client.release();
        if(err) return callback(err);

        self._checkSetCache(options, results);
        return process.nextTick(function() { callback(null, results); });
      });
    });
  });
};

database.close = function(callback) {
  if (!this._pool) {
    throw new Error('Database hasn\'t been configured yet!');
  }
  this._pool.end(callback);
};

database._checkGetCache = function(options, callback, next) {
  if (!this._cache || !options.cacheDuration) return next();

  this._cache.findObject(projectName + (options.caller || ''), options, function(err, response) {
    if (!err && !options.noCache && response) {
      var cacheResult;
      try {
        cacheResult = JSON.parse(response);
      } catch(e) {
        return next();
      }
      return process.nextTick(function() { callback(null, cacheResult); });
    }
    return next();
  });
};

database._checkSetCache = function(options, results) {
  if (!this._cache || !options.cacheDuration) return;
  if (!results || (results.length == 0 && !options.cacheEmptyResults)) return;

  this._cache.storeObject(projectName + (options.caller || ''), options, results);
};
