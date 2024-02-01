import { Outlet } from "react-router-dom"
import CategoryAll from "./components/CategoryAll"
import CategoryPersonal from "./components/CategoryPersonal"
import CategoryWork from "./components/CategoryWork"
import Header from "./components/Header"
import TodoLogo from "./components/TodoLogo"
import CategoryCompleted from "./components/CategoryCompleted"

function App() {
    return (
        <>
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-gray-100/40 lg:block ">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-[60px] items-center border-b px-6">
                            <TodoLogo />
                        </div>

                        <CategoryAll />
                        <CategoryWork />
                        <CategoryPersonal />
                        <CategoryCompleted />
                    </div>
                </div>
                <div className="flex flex-col">
                    {/*header */}
                    <Header />
                    {/*main */}
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default App
