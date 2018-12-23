/**
* Very simple CRUD template for a database
*/

const mysql = require('mysql');
const ALL_FUNC = { toSqlString: () => '*' };

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
    return this.runQuery(
      "INSERT INTO ?? SET ?", [table, values]
    );
  }

  readRecords({ table, columns = ALL_FUNC, identifiers = 1 }) {
    /* An array of values cannot seem to handle a single entry of objects with a toSqlString property */
    let queryString = `SELECT ${columns === ALL_FUNC ? '?' : '??'} FROM ?? WHERE `;
    let processedIdentifiers = [1];
    if(identifiers !== 1) {
      let { string, values } = this.prepareIdentifiers(identifiers);
      queryString += string;
      processedIdentifiers = values;
    } else {
      queryString += '?';
    }
    return this.runQuery(
      queryString, [columns, table, ...processedIdentifiers]
    );
  }

  updateRecords(table, values, identifiers) {
    return this.runQuery(
      "UPDATE ?? SET ? WHERE ?", [table, values, identifiers]
    );
  }

  deleteRecord(table, identifiers) {
    return this.runQuery(
      "DELETE FROM ?? WHERE ?", [table, identifiers]
    );
  }

  close() {
    return this.con.end();
  }

  /* Helper functions */

  runQuery(query, inserts) {
    return new Promise((resolve, reject) => {
      this.con.query(query, inserts, (err, results, fields) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  prepareIdentifiers(identifiers) {
    let string = '';
    let first = true;
    const values = [];

    for(const key of Object.keys(identifiers)) {
      if(first) {
        string += '?? = ? ';
        first = false;
      } else {
        string += 'AND ?? = ? ';
      }
      values.push(key);
      values.push(identifiers[key]);
    }

    return {
      string,
      values
    };
  }

}

module.exports = Db;
