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
	// Create a channel to signal completion
	done := make(chan bool)

	// Run migrations down concurrently
	go func() {
		MigrationDown(db)
		// Signal completion to the channel
		done <- true
	}()

	// Wait for the first function to complete
	<-done

	// Run migrations up concurrently
	go func() {
		MigrationUP(db)
		// Signal completion to the channel
		done <- true
	}()

	// Wait for the second function to complete
	<-done

	// Insert mock data concurrently
	go func() {
		MockData(db)
		// Signal completion to the channel
		done <- true
	}()

	// Wait for the third function to complete
	<-done
	if err != nil {
		log.Fatal(err)
	}
	s := &service{db: db}
	return s
}

func (s *service) CreateTodo(data models.TodoCreate) (models.Todo, error) {
	var todo models.Todo
	query := `INSERT INTO todos
        (title, description, created_at, updated_at, due_date)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id, title, description, created_at, updated_at, due_date;`
	err := s.db.QueryRow(query, data.Title, data.Description, time.Now().UTC(), time.Now().UTC(), data.DueDate).
		Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CreatedAt, &todo.UpdatedAt, &todo.DueDate)
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
		err := rows.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CurrentState, &todo.CreatedAt, &todo.UpdatedAt, &todo.DueDate)
		if err != nil {
			return todos, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}
