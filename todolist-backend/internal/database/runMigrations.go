package database

import (
	"database/sql"
	"fmt"
	"log"
)

func MigrationUP(db *sql.DB) {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description text NOT NULL,
        current_state VARCHAR(255) NOT NULL CHECK (current_state IN ('todo', 'progress', 'completed')) default 'todo',
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        due_date TIMESTAMP
    );`)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        todo_id INT REFERENCES todos(id),
        name VARCHAR(255) NOT NULL
    );`)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Migrations ran successfully")
}

func MigrationDown(db *sql.DB) {
	_, err := db.Exec(`DROP TABLE IF EXISTS todos cascade;`)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`DROP TABLE IF EXISTS tags;`)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Migrations rolled back successfully")
}

func MockData(db *sql.DB) {
	// Insert data into 'todos' table
	_, err := db.Exec(`
        INSERT INTO todos
        (title,description, current_state, created_at, updated_at, due_date)
        VALUES
        ('Todo 1', 'Description 1 has more description give some sample data ', 'todo', '2021-01-01', '2021-01-01', '2021-01-01'),
        ('Todo 2', 'Description 2 has more description give some sample data ', 'todo', '2021-01-01', '2021-01-01', '2021-01-01'),
        ('Todo 3', 'Description 3 has more description give some sample data ', 'todo', '2021-01-01', '2021-01-01', '2021-01-01'),
        ('Todo 4', 'Description 4 has more description give some sample data ', 'todo', '2021-01-01', '2021-01-01', '2021-01-01');
    `)
	if err != nil {
		log.Fatal(err)
	}

	// Insert data into 'tags' table
	_, err = db.Exec(`
        INSERT INTO tags(todo_id, name)
        VALUES
        (1, 'Tag 1'),
        (2, 'Tag 2'),
        (3, 'Tag 3'),
        (4, 'Tag 4');
    `)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Mock data inserted successfully")
}

