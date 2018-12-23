# Node MySQL database demo

This is a very simple demo, exploring how Node with the mysql node package can be used for a simple CRUD application.

The whole thing is set up using only two classes, the more abstract and reusable Db.js and the User.js implementation of this, assuming you have a `users` table in your designated database.

## Setup

The config is set in the db-config.json file, like so:

```
{
  "host": "host",
  "user": "user",
  "password": "password",
  "database": "database"
}
```

Running the db-cli.js will read all records from your database, create a new record, update that record, and finally delete it. In between it will also read records based on identifiers and will return only specified columns. The db-cli.js relies on async/await handling of promises so it can all be performed in one nice list. It assumes your `users` table uses this schema:

```
{
  id: 1,
  firstname: '',
  lastname: ''
}
```

Where `id` is the primary auto-incrementing key

## Functionality

The mysql node package already provides some great functionality for generating prepared statements. The only hard one to tackle is to get them in for `WHERE ?? = ? AND ?? = ?` type identifiers, having to go over an object yourself and translating the identifiers into an array and keeping track of how many `AND ?? = ?` insertions you need. Feels messy, I wonder if that can be done more efficiently.

I also don't like that if you want to do `SELECT * FROM users` or `SELECT 'firstname', 'lastname' FROM users`, you seem to need a different interpolation symbol (either `??` or `?`) for either cases. Would be nice if that could be flattened, not having to pollute de Db.js with a line like ``let queryString = `SELECT ${columns === ALL_FUNC ? '?' : '??'} FROM ?? WHERE `;``.

The way the queries are built up are a little nice and modular now. You can build the query and its values up piece by piece using the `SimpleQueryBuilder` class, which returns itself after every piece you insert, so you can build it up like `const query = new SimpleQueryBuilder().select().from(table).where(identifiers);`. That makes rendering all the parts of query easier and more reusable, just stacking the building steps in different ways.

Error handling is poor at best right now.

The Db and Users classes actually return a promise in their constructor, but when this promise resolves, the `this` instance of the class is passed back. So in the `then(db => { /* Do something with db instance */ })` of the promise that the constructor returns, you should find the instance. The `db-cli.js` actually receives it with an `await`.

Runs on Node v11.4.0
