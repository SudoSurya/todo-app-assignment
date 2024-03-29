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
	insertdefaulttag := `INSERT INTO tags (name, todo_id) VALUES ($1, $2);`

	_, err = s.db.Exec(insertdefaulttag, data.Category, todo.ID)
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

func (s *service) GetAllTodos() ([]GetTodosResponse, error) {
	var todos []GetTodosResponse

	query := `SELECT id, title, description, due_date FROM todos WHERE current_state!='completed';`

	rows, err := s.db.Query(query)
	if err != nil {
		return []GetTodosResponse{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var todo GetTodosResponse
		err := rows.Scan(&todo.Id, &todo.Title, &todo.Description, &todo.Due_date)
		if err != nil {
			return []GetTodosResponse{}, err
		}
		todos = append(todos, todo)
	}

	if err != nil {
		return []GetTodosResponse{}, err
	}
	return todos, nil
}

func (s *service) CompletedTodos() ([]GetTodosResponse,error){
    var todos []GetTodosResponse

    query := `SELECT id, title, description, due_date FROM todos WHERE current_state='completed';`

    rows, err := s.db.Query(query)
    if err != nil {
        return []GetTodosResponse{}, err
    }
    defer rows.Close()

    for rows.Next() {
        var todo GetTodosResponse
        err := rows.Scan(&todo.Id, &todo.Title, &todo.Description, &todo.Due_date)
        if err != nil {
            return []GetTodosResponse{}, err
        }
        todos = append(todos, todo)
    }

    if err != nil {
        return []GetTodosResponse{}, err
    }
    return todos, nil
}

func (s *service) GetTodos(category string) ([]GetTodosResponse, error) {
	var todos []GetTodosResponse
	/* query todos by category */
	query := `SELECT id, title, description, due_date FROM todos WHERE category = $1 and current_state!='completed';`
	if category == "all" {
		return s.GetAllTodos()
	} else if category == "completed" {
        return s.CompletedTodos()
    }

	rows, err := s.db.Query(query, category)
	if err != nil {
		return []GetTodosResponse{}, err
	}
	defer rows.Close()

	for rows.Next() {
		var todo GetTodosResponse
		err := rows.Scan(&todo.Id, &todo.Title, &todo.Description, &todo.Due_date)
		if err != nil {
			return []GetTodosResponse{}, err
		}
		todos = append(todos, todo)
	}

	if err != nil {
		return []GetTodosResponse{}, err
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

func (s *service) UpdateTodos(updatedData models.TodoUpdate) error {
	query := `UPDATE todos SET title = $1, description = $2, due_date = $3,
                category = $4, updated_at = $5, current_state =$6 WHERE id = $7;`
	updateTagQuery := `UPDATE tags SET name = $1 WHERE todo_id = $2;`

	_, err := s.db.Exec(query, updatedData.Title, updatedData.Description,
		updatedData.DueDate, updatedData.Category, time.Now().UTC(), updatedData.CurrentState, updatedData.ID)
	if err != nil {
		return err
	}

	for _, tag := range updatedData.Tags {
		_, err := s.db.Exec(updateTagQuery, tag, updatedData.ID)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *service) DeleteTodo(id string) error {
	query := `DELETE FROM todos WHERE id = $1;`
	deleteTagQuery := `DELETE FROM tags WHERE todo_id = $1;`
	_, err := s.db.Exec(deleteTagQuery, id)
	if err != nil {
		return err
	}
	_, err = s.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
