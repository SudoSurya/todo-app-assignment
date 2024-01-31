package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"
	"todolist-backend/internal/models"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

type Service interface {
	CreateTodo(data models.TodoCreate) (models.Todo, error)
    GetTodos() ([]models.Todo, error)
}

type service struct {
	db *sql.DB
}

var (
	database = os.Getenv("DB_DATABASE")
	password = os.Getenv("DB_PASSWORD")
	username = os.Getenv("DB_USERNAME")
	port     = os.Getenv("DB_PORT")
	host     = os.Getenv("DB_HOST")
)

func New() Service {
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, password, host, port, database)
	db, err := sql.Open("pgx", connStr)
	go Migrations(db)
	if err != nil {
		log.Fatal(err)
	}
	s := &service{db: db}
	return s
}

func Migrations(db *sql.DB) {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        current_state VARCHAR(255) NOT NULL CHECK (current_state IN ('todo', 'progress', 'completed')),
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

func (s *service) CreateTodo(data models.TodoCreate) (models.Todo, error) {
	var todo models.Todo
	query := `INSERT INTO todos
        (title, description, current_state, created_at, updated_at, due_date)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id, title, description, current_state, created_at, updated_at, due_date;`
	err := s.db.QueryRow(query, data.Title, data.Description, data.CurrentState, time.Now().UTC(), time.Now().UTC(),time.Now().UTC()).
		Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CurrentState, &todo.CreatedAt, &todo.UpdatedAt, &todo.DueDate)
	if err != nil {
		return todo, err
	}
	return todo, nil
}

func (s *service) GetTodos() ([]models.Todo, error) {
    var todos []models.Todo
    query := `SELECT id,title,description,current_state,created_at,updated_at,due_date FROM todos`
    rows, err := s.db.Query(query)
    if err != nil {
        return todos, err
    }
    for rows.Next() {
        var todo models.Todo
        err := rows.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CurrentState, &todo.CreatedAt, &todo.UpdatedAt,&todo.DueDate)
        if err != nil {
            return todos, err
        }
        todos = append(todos, todo)
    }
    return todos, nil
}
