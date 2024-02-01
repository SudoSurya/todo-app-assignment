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
        category VARCHAR(255) NOT NULL CHECK (category IN ('work','personal')),
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
        (title, description, current_state, created_at, updated_at, due_date, category)
        VALUES
        ('Complete Project Proposal', 'Research and write a detailed project proposal for upcoming client meeting', 'todo', '2021-01-01', '2021-01-01', '2021-02-15', 'work'),
        ('Prepare Presentation Slides', 'Create engaging presentation slides for the team meeting on project updates', 'todo', '2021-01-05', '2021-01-05', '2021-02-20', 'work'),
        ('Review Code Changes', 'Go through recent code changes and provide feedback to the development team', 'todo', '2021-01-10', '2021-01-10', '2021-02-25', 'work'),
        ('Attend Project Kickoff', 'Join the project kickoff meeting with the client and discuss project milestones', 'todo', '2021-01-15', '2021-01-15', '2021-03-01', 'work');
    `)
	if err != nil {
		log.Fatal(err)
	}

	// Insert data into 'tags' table
	_, err = db.Exec(`
        INSERT INTO tags(todo_id, name)
        VALUES
        (1, 'Client Meeting'),
        (1, 'Research'),
        (2, 'Presentation'),
        (2, 'Team Meeting'),
        (3, 'Code Review'),
        (4, 'Project Kickoff');
    `)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Mock data inserted successfully")
}
