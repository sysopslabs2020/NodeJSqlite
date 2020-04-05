//load sqlite3 module and manage error exception
var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

//The err parameter is null when all OK, Else it contains the error to inform the user (err.message)
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE bugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            type text,
            description text,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO bugs (name, type, description, timestamp) VALUES (?,?,?,?)'
                db.run(insert, ["Pippo","High","Production Problem"])
                db.run(insert, ["Mario","Low","Dev Problem"])
            }
        });
    }
});
// Now "export" the database connection object "db" to be imported in another script (server.js)
module.exports = db
