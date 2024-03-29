import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddTodo from './components/AddTodo.tsx'
import { TodosSkeleton } from './components/Todo.tsx'
import SingleTodo from './components/SingleTodo.tsx'
import WorkTodos from './components/WorkTodos.tsx'
import PersonalTodos from './components/PersonalTodos.tsx'
import CompletedTodos from './components/CompletedTodos.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} >
                    <Route path="/" element={<TodosSkeleton />} />
                    <Route path="/addtodo" element={<AddTodo />} />
                    <Route path="/viewtodo/:id" element={<SingleTodo />} />
                    <Route path="/work/todos" element={<WorkTodos />} />
                    <Route path="/personal/todos" element={<PersonalTodos />} />
                    <Route path="/completed" element={<CompletedTodos />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
