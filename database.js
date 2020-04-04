var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

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
            type text UNIQUE,
            description text,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO bugs (name, type, description, timestamp) VALUES (?,?,?,?)'
                db.run(insert, ["dev","High","Production Problem"])
                db.run(insert, ["admin","Low","Dev Problem"])
            }
        });
    }
});


module.exports = db
