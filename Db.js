/**
* Very simple CRUD template for a database
*/

const mysql = require('mysql');
const SimpleQueryBuilder = require('./SimpleQueryBuilder.js');

class Db {

  constructor(config) {
    this.con = mysql.createConnection(config);
    return new Promise((resolve, reject) => {
      this.con.connect((err) => {
        if (err) reject(err);
        resolve(this);
      });
    });
  }

  createRecord(table, values) {
    const query = new SimpleQueryBuilder()
      .insert()
      .into(table)
      .set(values);

    return this.runQuery(query.getQuery());
  }

  readRecords({ table, columns = '*', identifiers = 1 }) {
    const query = new SimpleQueryBuilder()
      .select(columns)
      .from(table)
      .where(identifiers);

    return this.runQuery(query.getQuery());
  }

  updateRecords(table, values, identifiers) {
    const query = new SimpleQueryBuilder()
      .update(table)
      .set(values)
      .where(identifiers);

    return this.runQuery(query.getQuery());
  }

  deleteRecord(table, identifiers) {
    const query = new SimpleQueryBuilder()
      .delete()
      .from(table)
      .where(identifiers);

    return this.runQuery(query.getQuery());
  }

  close() {
    return this.con.end();
  }

  /* Helper functions */

  runQuery({ string, values }) {
    return new Promise((resolve, reject) => {
      this.con.query(string, values, (err, results, fields) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

}

module.exports = Db;
