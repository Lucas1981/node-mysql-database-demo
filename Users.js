/**
* This is a simple implementation of the Db class. At first I thought about extending it,
* but in fact it is better to use composition so as to hide all the Db methods that we
* don't use from the implementing class.
*/

const Db = require('./Db.js');
const table = 'users';
const all = '*';

class Users {
  constructor(config) {
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

  createUser(attributes) {
    return this.db.createRecord(table, attributes);
  }

  readUsers({ identifiers = null, columns = null } = {}) {
    return this.db.readRecords({
      table,
      ...(identifiers === null ? {} : { identifiers }),
      ...(columns === null ? {} : { columns })
    });
  }

  updateUser(id, newAttributes) {
    return this.db.updateRecords(table, newAttributes, { id });
  }

  deleteUser(id) {
    return this.db.deleteRecord(table, { id });
  }

  close() {
    return this.db.close();
  }

}
module.exports = Users;
