import axios from "axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { THEAD } from "./Thead";

type Todo = {
    id: string,
    title: string,
    description: string,
    current_status: string,
    created_at: string,
    updated_at: string,
    due_date: string
}

interface TodosProps {
    category: string; // or the specific type you expect
}

export const Todos: React.FC<TodosProps> = ({ category }) => {
    const [todos, setTodos] = useState<Todo[] | null>([])

    const deleteTodo = async (id: string) => {
        try {
            const res = await axios.delete(`http://localhost:8000/deletetodo/${id}`)
            toast.success(res.data.message)
            getTodos(category)
        } catch (error) {
            console.log(error)
        }
    }
    const getTodos = async (category: string) => {
        try {
            const res = await axios.get(`http://localhost:8000/todos/${category}`)
            setTodos(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getTodos(category)
    }, [category])
    return (
        <>
            <Toaster />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center">
                    <h1 className="font-semibold text-lg md:text-2xl">Todos</h1>
                    <Link to="/addtodo"
                        className="inline-flex items-center justify-center whitespace-nowrap
                        text-sm font-medium h-9 rounded-md px-3 ml-auto text-white bg-indigo-600"

                    >
                        Add Todo
                    </Link>
                </div>
                <div className="border shadow-sm rounded-lg">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <THEAD />
                            {todos && <TBody todos={todos} deletetodo={deleteTodo} />}
                        </table>
                    </div>
                </div>
            </main >
        </>
    )
}

export const TodosSkeleton = () => {
    return <Todos category="all" />
}


interface TBodyProps {
    todos: Todo[];
    deletetodo: (todo: string) => void;
}
export const TBody: React.FC<TBodyProps> = ({ todos, deletetodo }) => {
    return (
        <tbody>
            {
                todos && todos.map((todo: Todo, index: number) => {
                    const dueDate = new Date(todo.due_date).toDateString();
                    return (
                        <tr key={todo.id} className={`cursor-pointer border-b ${index % 2 == 0 ? "bg-gray-300" : ""}`} >
                            <td className="p-4 align-middle font-medium">{todo.title}</td>
                            <td className="p-4 align-middle hidden md:table-cell">
                                {todo.description.split(' ').slice(0, 6).join(' ')} ...
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">{dueDate}</td>
                            <td onClick={() => deletetodo(todo.id)} className="p-4 align-middle hidden md:table-cell">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">
                                <Link to={`/viewtodo/${todo.id}`}
                                    className="inline-flex items-center justify-center whitespace-nowrap
                                    text-sm font-medium h-9 rounded-md px-3 ml-auto text-white bg-indigo-600"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    )
                })
            }
        </tbody>
    )
}
