const Users = require('./Users.js');
const config = require('./db-config.json');

try {
  main();
} catch(err) {
  console.log("An error occurred");
  console.log(err);
}

async function main() {
  const db = await new Users(config);
  console.log("Established database connection");
  const initialUsers = await db.readUsers();
  console.log("\nAll users");
  console.log(initialUsers);
  const createdUser = await db.createUser({
    firstname: "John",
    lastname: "Dee"
  });
  const users = await db.readUsers();
  console.log("\nAll users after creating new user");
  console.log(users);

  const john = (await db.readUsers({
    identifiers: { firstname: 'John', lastname: 'Dee' }
  }))[0];
  console.log("\nSelected user with attributes { firstname: 'John', lastname: 'Dee' }");
  console.log(john);

  const adjustedUser = await db.updateUser(john.id, { lastname: 'Doe' });
  const updatedUsers = await db.readUsers();
  console.log("\nAll users after updating user");
  console.log(updatedUsers);

  const firstNames = await db.readUsers({
    columns: ['firstname', 'lastname']
  });
  console.log("\nAll firstnames and lastnames of the current users");
  console.log(firstNames);

  const deletedUser = await db.deleteUser(john.id);
  const allUsersAfterDelete = await db.readUsers();
  console.log("\nAll users after deleting user");
  console.log(allUsersAfterDelete);

  db.close();
  console.log("\nClosed database connection");
}
