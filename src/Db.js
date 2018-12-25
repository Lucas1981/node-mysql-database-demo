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

  close() {
    return this.con.end();
  }

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
