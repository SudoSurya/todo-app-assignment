import Header from "./Header";

export default function Navbar() {
    return (
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                <Header />
            </nav>
        </div>
    )
}
