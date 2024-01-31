import TodoForm from "./TodoForm";

export default function AddTodo() {
    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-10 md:gap-8 md:p-6">
                <TodoForm />
            </main>
        </>
    )
}
