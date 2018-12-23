/**
* It is more neat to build up the queries part by part, using a chainable method where the object
* keeps being returned, so you can do a sqb.select().from('users')... type chain. It was inspired
* from other frameworks.
*/

class SimpleQueryBuilder {
  constructor() {
    this.string = '';
    this.values = [];
  }

  getString() {
    return this.string;
  }

  getValues() {
    return this.values;
  }

  select(columns = '*') {
    this.string += 'SELECT';
    if(columns === '*') {
      this.string += ' * ';
    } else {
      this.string += ' ?? ';
      this.values.push(columns);
    }
    return this;
  }

  insert() {
    this.string += 'INSERT ';
    return this;
  }

  update(table) {
    this.string += 'UPDATE ?? ';
    this.values.push(table);
    return this;
  }

  delete() {
    this.string += 'DELETE ';
    return this;
  }

  into(table) {
    this.string += 'INTO ?? ';
    this.values.push(table);
    return this;
  }

  from(table) {
    this.string += ' FROM ?? ';
    this.values.push(table);
    return this;
  }

  where(identifiers) {
    if(identifiers !== 1) {
      const { string, values } = this.compileWhereIdentifiers(identifiers);
      this.string += ` WHERE ${string} `;
      this.values.push(...values);
    } else {
      this.string += ' WHERE ? ';
      this.values.push([1]);
    }
    return this;
  }

  set(values) {
    this.string += ' SET ? ';
    this.values.push(values);
    return this;
  }

  getQuery() {
    return {
      string: this.string,
      values: this.values
    };
  }

  compileWhereIdentifiers(identifiers) {
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

module.exports = SimpleQueryBuilder;
