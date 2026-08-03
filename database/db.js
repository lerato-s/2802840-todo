const sqlite3 = require('better-sqlite3');  //sqlite used
const path = require('path'); 

const db = new sqlite3(path.join(process.cwd(), 'tasks.db'));  // current working directory, 


/*
columns needed:
id - primary key integer with autoincrement
title - text
description - text
due date - text (sqlite has no date)
topic - text
is_archived - 0 or 1 boolean (0 is false, 1 is true)
status - text but add check so that only todo, in-progress and complete are allowed (todo is defualt)


*/ 
db.exec(`
    
    CREATE TABLE IF NOT EXISTS tasks(

        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        due_date TEXT NOT NULL,
        topic TEXT NOT NULL,
        is_archived INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL CHECK (status IN ('Todo', 'In-Progress', 'Complete')) DEFAULT 'Todo'

    )`
);

module.exports = db; // makes db available for other files
