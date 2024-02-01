package database

import (
	"time"
	"todolist-backend/internal/models"
)

func (s *service) CreateTodo(data models.TodoCreate) (models.Todo, error) {
	var todo models.Todo
	query := `INSERT INTO todos
        (title, description, created_at, updated_at, due_date,category)
        VALUES($1, $2, $3, $4, $5,$6)
        RETURNING id, title, description, created_at, updated_at, due_date,category;`
	err := s.db.QueryRow(query, data.Title, data.Description, time.Now().UTC(), time.Now().UTC(), data.DueDate, data.Category).
		Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CreatedAt, &todo.UpdatedAt, &todo.DueDate, &todo.Category)
	if err != nil {
		return todo, err
	}
	return todo, nil
}

type GetTodosResponse struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Due_date    string `json:"due_date"`
}

func (s *service) GetTodos() ([]GetTodosResponse, error) {
	var todos []GetTodosResponse
	query := `SELECT
                id,
                title,
                description,
                due_date
        FROM todos where current_state !='completed'`
	rows, err := s.db.Query(query)
	if err != nil {
		return todos, err
	}
	for rows.Next() {
		var todo GetTodosResponse
		err := rows.Scan(&todo.Id, &todo.Title, &todo.Description, &todo.Due_date)
		if err != nil {
			return todos, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}

func (s *service) GetTodoById(id string) (models.Todo, error) {
	var todo models.Todo
	/*
	 * get all todos by id
	 * get all tags by id
	 */

	todosQuery := `SELECT id, title, description, current_state, created_at, updated_at, due_date,category
     FROM todos WHERE id = $1;`

	err := s.db.QueryRow(todosQuery, id).Scan(
		&todo.ID,
		&todo.Title,
		&todo.Description,
		&todo.CurrentState,
		&todo.CreatedAt,
		&todo.UpdatedAt,
		&todo.DueDate,
		&todo.Category,
	)
    if err != nil {
        return models.Todo{}, err
    }

	tagsQuery := `SELECT name FROM tags WHERE todo_id = $1;`

	rows, err := s.db.Query(tagsQuery, id)
    if err != nil {
        return models.Todo{}, err
    }
    defer rows.Close()
	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)

        if err != nil {
            return models.Todo{}, err
        }
		todo.Tags = append(todo.Tags, tag)
	}

	if err != nil {
		return models.Todo{}, err
	}

	return todo, nil
}
