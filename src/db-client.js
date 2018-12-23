const Table = require('./Table.js');
const config = require('./db-config.json');
const table = 'users';

try {
  main();
} catch(err) {
  console.log("An error occurred");
  console.log(err);
}

async function main() {
  const usersTable = await new Table(table, config);
  console.log("Established database connection");

  const initialUsers = await usersTable.read();
  console.log("\nAll users");

  console.log(initialUsers);
  const createdUser = await usersTable.create({
    firstname: "John",
    lastname: "Dee"
  });
  const users = await usersTable.read();
  console.log("\nAll users after creating new user");
  console.log(users);

  const john = (await usersTable.read({
    identifiers: { firstname: 'John', lastname: 'Dee' }
  }))[0];
  console.log("\nSelected user with attributes { firstname: 'John', lastname: 'Dee' }");
  console.log(john);

  const adjustedUser = await usersTable.update(john.id, { lastname: 'Doe' });
  const updatedUsers = await usersTable.read();
  console.log("\nAll users after updating user");
  console.log(updatedUsers);

  const fullNames = await usersTable.read({
    columns: ['firstname', 'lastname']
  });
  console.log("\nAll firstnames and lastnames of the current users");
  console.log(fullNames);

  const deletedUser = await usersTable.delete(john.id);
  const allUsersAfterDelete = await usersTable.read();
  console.log("\nAll users after deleting user");
  console.log(allUsersAfterDelete);

  usersTable.close();
  console.log("\nClosed database connection");
}
