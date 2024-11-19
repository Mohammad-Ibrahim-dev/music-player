// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('musicDb');

// Create a new document in the collection.
db.getCollection('otps').insertOne({
   email:"ibr4156@gmail.com",
   otp:"654321"
});
