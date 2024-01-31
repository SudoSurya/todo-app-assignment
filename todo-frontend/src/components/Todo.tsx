import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
type Todo = {
    id: string,
    title: string,
    description: string,
    current_status: string,
    created_at: string,
    updated_at: string,
    due_date: string
}

export default function Todos() {
    const [todos, setTodos] = useState<Todo[] | null>([])
    const getTodos = async () => {
        try {
            const res = await axios.get("http://localhost:8080/gettodos")
            setTodos(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getTodos()
    }, [])
    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center">
                    <h1 className="font-semibold text-lg md:text-2xl">Todos</h1>
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 ml-auto text-white bg-black">
                        <Link to="/addtodo">
                            Add Todo
                        </Link>
                    </button>

                </div>
                <div className="border shadow-sm rounded-lg">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <THEAD />
                            {todos && <TBody todos={todos} />}
                        </table>
                    </div>
                </div>
            </main >
        </>
    )
}

const THEAD = () => {
    return (
        <thead className="[&amp;_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 max-w-[150px]">
                    Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                    Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                    Due Date
                </th>
            </tr>
        </thead>
    )
}


const TBody = ({ todos }: { todos: Todo[] }) => {
    return (
        <tbody className="[&amp;_tr:last-child]:border-0">
            {
                todos && todos.map((todo: Todo) => {
                    const dueDate = new Date(todo.due_date).toDateString();
                    return (
                        <tr key={todo.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" >
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">{todo.title}</td>
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                {todo.description}
                            </td>
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">{dueDate}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    )
}
