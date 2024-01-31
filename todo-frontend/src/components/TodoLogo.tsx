import { Link } from "react-router-dom"

export default function TodoLogo() {
    return (
        <Link to="/">
            <a className="flex items-center gap-2 font-semibold">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="">Todo App</span>
            </a>
        </Link>
    )
}

