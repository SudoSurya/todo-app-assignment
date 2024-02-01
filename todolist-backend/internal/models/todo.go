package models

type Todo struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	CurrentState string   `json:"current_state"` /* todo, progress, done */
	Category     string   `json:"category"`
	CreatedAt    string   `json:"created_at"`
	UpdatedAt    string   `json:"updated_at"`
	DueDate      string   `json:"due_date"`
	Tags         []string `json:"tags"`
}

type TodoCreate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	DueDate     string `json:"due_date"`
}

type TodoUpdate struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	CurrentState string   `json:"current_state"` /* todo, progress, done */
	Category     string   `json:"category"`
	DueDate      string   `json:"due_date"`
	Tags         []string `json:"tags"`
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
