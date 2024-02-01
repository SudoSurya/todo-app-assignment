import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

type SingleTodoParams = {
    id: string;
}

type TodoResponse = {
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


const TodoDetails = ({ todo }: { todo: TodoResponse }) => {
    const [editedTodo, setEditedTodo] = useState<TodoResponse>(todo)
    const history = useNavigate();

    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim() !== '' && !editedTodo.tags.includes(newTag)) {
            setEditedTodo({ ...editedTodo, tags: [...editedTodo.tags, newTag] });
            setNewTag('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        const updatedTags = editedTodo.tags.filter((tag) => tag !== tagToDelete);
        setEditedTodo({ ...editedTodo, tags: updatedTags });
    };
    function getRandomColor() {
        // Generate a random color in hexadecimal format
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function formatDateForInput(date: string) {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TodoResponse>()
    const onSubmit: SubmitHandler<TodoResponse> = (data) => {
        data.id = editedTodo.id;
        data.tags = editedTodo.tags;
        console.log(data.current_state)
        try {
            axios.put(`http://localhost:8000/updatetodo`, data)
                .then((res) => {
                    toast.success(res.data.message);
                }).catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Toaster/>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <div className="my-2.5">
                        <input
                            type="text"
                            id="title"
                            value={editedTodo.title}
                            {...register("title", { required: true })}
                            onChange={(e) => { setEditedTodo({ ...editedTodo, title: e.target.value }) }}
                            className="block w-full rounded-md border-0 px-3.5 py-4 font-bold
                            text-gray-900 shadow-sm
                            sm:text-sm"
                            style={{ fontSize: '1.5em', padding: '12px' }}
                            readOnly={false}
                        />
                    </div>
                    {errors.title && <span className="text-red-500">This Title is required</span>}
                </div>

                <div className="sm:col-span-2 flex justify-start items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <label htmlFor="message" className="block text-xl leading-6 text-gray-900">
                        Status:
                    </label>
                    <div className="my-2.5">
                        <select
                            id="state"
                            value={editedTodo.current_state}
                            {...register("current_state", { required: true })}
                            onChange={(e) => { setEditedTodo({ ...editedTodo, current_state: e.target.value }) }}
                            className="block rounded-md border-0 px-3.5 py-2
                            shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        >
                            <option value="todo">Todo</option>
                            <option value="progress">In Progress</option>
                            <option value="completed">Done</option>
                        </select>

                    </div>
                </div>
                <div className="sm:col-span-2 flex justify-start items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                    <label htmlFor="message" className="block text-xl leading-6 text-gray-900">
                        Category:
                    </label>
                    <div className="my-2.5">
                        <select
                            id="category"
                            value={editedTodo.category}
                            {...register("category", { required: true })}
                            onChange={(e) => { setEditedTodo({ ...editedTodo, category: e.target.value }) }}
                            className="block rounded-md border-0 px-3.5 py-2
                            shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        >
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-2 flex justify-start items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    <label htmlFor="message" className="block text-xl leading-6 text-gray-900">
                        Due Date:
                    </label>
                    <div className="my-2.5">
                        <input
                            type="date"
                            id="date"
                            value={formatDateForInput(editedTodo.due_date)}
                            {...register("due_date", { required: true })}
                            onChange={(e) => { setEditedTodo({ ...editedTodo, due_date: e.target.value }) }}
                            className="block rounded-md border-0 px-3.5 py-2
                            shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        />
                    </div>
                </div>
                <div className="sm:col-span-2 flex justify-start items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    <label htmlFor="message" className="block text-xl leading-6 text-gray-900">
                        Tags:
                    </label>
                    <div className="flex gap-1">
                        {editedTodo.tags.map((tag, index) => {
                            const randomColor = getRandomColor();
                            return (
                                <div onClick={() => handleDeleteTag(tag)} key={index} className="text-white my-2.5 p-2 text-xs rounded-md" style={{ backgroundColor: randomColor }}>
                                    {tag + '  '} <span className="text-black ml-5">X</span>
                                </div>
                            );
                        })}
                        <div className="flex gap-1 items-center m-1">
                            <input
                                type="text"
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add tag..."
                                className="block w-20 sm:w-28 rounded-md px-2 py-1 text-sm text-gray-900 shadow-sm outline-black"
                            />
                            <button
                                onClick={handleAddTag}
                                className="text-white text-sm font-normal bg-green-500 px-4  py-2 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-xl leading-6 text-gray-900">
                        Description:
                    </label>
                    <div className="my-2.5">
                        <textarea
                            id="description"
                            value={editedTodo.description}
                            {...register("description", { required: true })}
                            onChange={(e) => { setEditedTodo({ ...editedTodo, description: e.target.value }) }}
                            rows={10}
                            className="block w-full rounded-md border-0 px-3.5 py-2
                            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        />
                    </div>
                    {errors.description && <span className="text-red-500">This description is required</span>}
                </div>
            </div>
            <div className="mt-4 flex justify-start gap-x-4">
                <button
                    type="submit"
                    className="block rounded-md bg-indigo-600 px-3.5 py-2.5
                    text-center text-sm font-semibold text-white shadow-sm
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    Save Todo
                </button>
                <button onClick={() => history(-1)}
                    className="block rounded-md bg-red-600 px-4 py-2
                    text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </form >
    )
}



