// var someCache = require('someKindOfCache');
var database = require('./index');

database.configureWith({
  host: 'localhost',
  database: 'hapi',
  username: 'root',
  password: null,
  connectionLimit: 40
});
// database.useCache(someCache);

// Plain DB query:
database.query({
  sql: 'SELECT 1 + 1',
  values: [ 'john' ],
}, function(err, results) {

  console.log('Query returned with:', err, results);

});
