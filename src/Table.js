/**
* This is a simple implementation of the Db class. At first I thought about extending it,
* but in fact it is better to use composition so as to hide the Db methods that we
* don't use from the implementing class.
*/

const SimpleQueryBuilder = require('./SimpleQueryBuilder');
const all = '*';

class Table {
  constructor(table, db) {
    this.db = db;
    this.table = table;
  }

  create(values) {
    const query = new SimpleQueryBuilder()
      .insert()
      .into(this.table)
      .set(values);

    return this.db.runQuery(query.getQuery());
  }

  read({ columns = '*', identifiers = 1 } = { columns: '*', identifiers: 1}) {
    const query = new SimpleQueryBuilder()
      .select(columns)
      .from(this.table)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

  update(identifiers, values) {
    const query = new SimpleQueryBuilder()
      .update(this.table)
      .set(values)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

  delete(identifiers) {
    const query = new SimpleQueryBuilder()
      .delete()
      .from(this.table)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

}

module.exports = Table;
