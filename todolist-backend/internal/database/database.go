package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"todolist-backend/internal/models"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

type Service interface {
	CreateTodo(data models.TodoCreate) (models.Todo, error)
	GetTodos() ([]GetTodosResponse, error)
	GetTodoById(id string) (models.Todo, error)
	UpdateTodos(updatedData models.TodoUpdate) error
	DeleteTodo(id string) error
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
