import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddTodo from './components/AddTodo.tsx'
import Todos from './components/Todo.tsx'
import SingleTodo from './components/SingleTodo.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} >
                    <Route path="/" element={<Todos />} />
                    <Route path="/addtodo" element={<AddTodo />} />
                    <Route path="/viewtodo/:id" element={<SingleTodo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
