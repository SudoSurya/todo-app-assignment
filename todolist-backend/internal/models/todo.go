package models

type Todo struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	CurrentState string `json:"current_state"` /* todo, progress, done */
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
    DueDate      string `json:"due_date"`
}

type TodoCreate struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	CurrentState string `json:"current_state"`
    DueDate      string `json:"due_date"`
}

type TodoUpdate struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	CurrentState string `json:"current_state"`
}

type TodoDelete struct {
	ID string `json:"id"`
}

type TodoList struct {
	Todos []Todo `json:"todos"`
}

type TodoTags struct {
	ID   string   `json:"id"`
	Tags []string `json:"tags"`
}
