import { Link } from "react-router-dom";
import TodoForm from "./TodoForm";

export default function AddTodo() {
    return (
        <>
            <main className="flex flex-1 flex-col gap-4 px-10 md:gap-8 md:p-6">
                <div className="flex items-center">
                    <h1 className="font-semibold text-lg md:text-2xl">Add Todo</h1>
                    <Link to="/"
                        className="inline-flex items-center justify-center
                        whitespace-nowrap text-sm font-medium h-9
                        rounded-md px-3 ml-auto text-white bg-black"
                    >
                        Back to Todos
                    </Link>
                </div>
                <TodoForm />
            </main>
        </>
    )
}
