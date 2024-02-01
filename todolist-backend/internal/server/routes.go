package server

import (
	"encoding/json"
	"net/http"
	"todolist-backend/internal/models"
	"todolist-backend/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	// Enable CORS with default options
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Replace with your React app's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Post("/createtodo", s.createTodo)
	r.Get("/gettodos", s.getTodos)
    r.Get("/gettodo/{id}", s.getTodoById)
	return r
}

func (s *Server) createTodo(w http.ResponseWriter, r *http.Request) {
	var todoCreate models.TodoCreate

	err := json.NewDecoder(r.Body).Decode(&todoCreate)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	todo, err := s.db.CreateTodo(todoCreate)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
    utils.RespondWithJson(w, http.StatusOK, todo)
}

func (s *Server) getTodos(w http.ResponseWriter, r *http.Request) {

	todos, err := s.db.GetTodos()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
    utils.RespondWithJson(w, http.StatusOK, todos)
}


func (s *Server) getTodoById(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    todo, err := s.db.GetTodoById(id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    utils.RespondWithJson(w, http.StatusOK, todo)
}
