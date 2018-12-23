/**
* This is a simple implementation of the Db class. At first I thought about extending it,
* but in fact it is better to use composition so as to hide all the Db methods that we
* don't use from the implementing class.
*/

const Db = require('./Db.js');
const all = '*';

class Table {
  constructor(table, config) {
    this.table = table;
    return new Promise((resolve, reject) => {
      const dbPromise = new Db(config);
      dbPromise.then(db => {
        this.db = db;
        resolve(this);
      }).catch(err => {
        reject(err);
      });
    });
  }

  create(attributes) {
    return this.db.createRecord(this.table, attributes);
  }

  read({ identifiers, columns } = { identifiers: null, columns: null }) {
    return this.db.readRecords({
      table: this.table,
      ...(identifiers === null ? {} : { identifiers }),
      ...(columns === null ? {} : { columns })
    });
  }

  update(id, newAttributes) {
    return this.db.updateRecords(this.table, newAttributes, { id });
  }

  delete(id) {
    return this.db.deleteRecord(this.table, { id });
  }

  close() {
    return this.db.close();
  }

}
module.exports = Table;
