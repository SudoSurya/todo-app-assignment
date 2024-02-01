import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TodoDetails } from "./TodoDetails";

type SingleTodoParams = {
    id: string;
}
export type TodoResponse = {
    id: string,
    title: string,
    description: string,
    current_state: string,
    category: string,
    created_at: string,
    updated_at: string,
    due_date: string
    tags: string[]
}

const getTodo = async (id: string) => {
    try {
        const res = await axios.get<TodoResponse>(`http://localhost:8000/gettodo/${id}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export default function SingleTodo() {
    const { id } = useParams<SingleTodoParams>();
    const history = useNavigate();

    const [todo, setTodo] = useState<TodoResponse | null>(null)

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const res = await getTodo(id as string)
                setTodo(res as TodoResponse)
            } catch (error) {
                console.log(error)
            }
        }
        fetchTodo()
    }, [id])

    return (
        <main className="flex flex-1 flex-col gap-4 px-10 md:gap-8 md:p-6">
            <div className="flex items-center">
                <h1 className="font-semibold text-lg md:text-2xl">View Todo</h1>
                <button onClick={() => history(-1)}
                    className="inline-flex items-center justify-center
                        whitespace-nowrap text-sm font-medium h-9
                        rounded-md px-3 ml-auto text-white bg-black"
                >
                    Back to Todos
                </button>
            </div>
            {todo && <TodoDetails todo={todo} />}
        </main>
    )
}

