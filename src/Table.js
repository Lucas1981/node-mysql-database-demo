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
    /* Best to add the SimpleQueryBuilder as a member to make it available for extended classes*/
    this.SimpleQueryBuilder = SimpleQueryBuilder;
    this.table = table;
  }

  create(values) {
    const query = new this.SimpleQueryBuilder()
      .insert()
      .into(this.table)
      .set(values);

    return this.db.runQuery(query.getQuery());
  }

  read({ columns = '*', identifiers = 1 } = { columns: '*', identifiers: 1}) {
    const query = new this.SimpleQueryBuilder()
      .select(columns)
      .from(this.table)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

  update(identifiers, values) {
    const query = new this.SimpleQueryBuilder()
      .update(this.table)
      .set(values)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

  delete(identifiers) {
    console.log('Before we choke');
    console.log(identifiers);
    const query = new this.SimpleQueryBuilder()
      .delete()
      .from(this.table)
      .where(identifiers);

    return this.db.runQuery(query.getQuery());
  }

}

module.exports = Table;
