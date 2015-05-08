# Database
A mysql wrapper with caching layer.

We use [node-cache](https://github.com/holidayextras/node-cache) for the `someCache`.

```javascript
var someCache = require('someKindOfCache');
var database = require('database');

database.configureWith({
  host: 'localhost',
  database: 'test',
  username: 'root',
  password: '',
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
