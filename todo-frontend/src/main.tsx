import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddTodo from './components/AddTodo.tsx'
import Todos from './components/Todo.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} >
                    <Route path="/" element={<Todos/>} />
                    <Route path="/addtodo" element={<AddTodo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
