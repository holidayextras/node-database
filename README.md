
# Database

```
var someCache = require('someKindOfCache');
var database = require('database');

database.configureWith({
  host: 'localhost',
  database: 'hapi',
  username: 'root',
  password: 'password',
  connectionLimit: 40
});
database.useCache(someCache);

// Plain DB query:
database.query({
  sql: 'SELECT * from someTable WHERE name = ?',
  values: [ 'john' ],
}, function(err, results) {

  console.log('Query returned with:', err, results);

});

// Cached DB query:
database.query({
  sql: 'SELECT * from someTable WHERE name = ?',
  values: [ 'john' ],
  caller: 'descriptionOfOwner',
  cacheDuration: (2 * 60 * 60),
  cacheEmptyResults: true,
  noCache: false              // pass true to bypass the cache
}, function(err, results) {

  console.log('Query returned with:', err, results);

});
```

##### Additional Configuration Options

Port, specify the port number you want to use to connect, e.g. `port: 3000`. Will resort to the default port if not used.

Timezone, specify the timezone you want to use when connecting to the database, e.g. `timezone: '0000'` for UTC. Will default to the system timezone if not specified.
