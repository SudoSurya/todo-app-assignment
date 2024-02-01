import axios from "axios"
import { SubmitHandler, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

type Inputs = {
    title: string,
    due_date: string,
    description: string
    category: 'work' | 'personal'
}
export default function TodoForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        try {
            axios.post("http://localhost:8000/createtodo", data)
                .then(() => {
                    toast.success("Added to cart");
                }).catch((err) => {
                    toast.error(err.response.data.error)
                })
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            navigate("/")
        }, 2000);
    }
    return (
        <form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <Toaster />
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                        Title
                    </label>
                    <div className="my-2.5">
                        <input
                            type="text"
                            id="title"
                            {...register("title", { required: true })}
                            className="block w-full rounded-md border-0 px-3.5 py-2
                            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        />
                    </div>
                    {errors.title && <span className="text-red-500">This Title is required</span>}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                        Due Date
                    </label>
                    <div className="my-2.5">
                        <input
                            type="date"
                            id="date"
                            {...register("due_date", { required: true })}
                            className="block w-full rounded-md border-0 px-3.5 py-2
                            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        />
                    </div>
                    {errors.due_date && <span className="text-red-500">This due date is required</span>}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                        Category
                    </label>
                    <div className="my-2.5">
                        <select
                            id="category"
                            {...register("category", { required: true })}
                            className="block w-full rounded-md border-0 px-3.5 py-2
                            shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                        >
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                    {errors.due_date && <span className="text-red-500">This due date is required</span>}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                        Description
                    </label>
                    <div className="my-2.5">
                        <textarea
                            id="description"
                            {...register("description", { required: true })}
                            rows={4}
                            className="block w-full rounded-md border-0 px-3.5 py-2
                            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            sm:text-sm"
                            defaultValue={''}
                        />
                    </div>
                    {errors.description && <span className="text-red-500">This description is required</span>}
                </div>
            </div>
            <div className="mt-10">
                <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5
                    text-center text-sm font-semibold text-white shadow-sm
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    Add Todo
                </button>
            </div>
        </form>
    )
}
