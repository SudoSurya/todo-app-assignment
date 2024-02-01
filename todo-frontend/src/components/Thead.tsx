export const THEAD = () => {
    return (
        <thead className="[&amp;_tr]:border-b">
            <tr className="border-b ">
                <th className="h-12 px-4 text-left align-middle font-bold max-w-[150px]">
                    Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold hidden md:table-cell">
                    Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold hidden md:table-cell">
                    Due Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold hidden md:table-cell">
                    Delete
                </th>
                <th className="h-12 px-4 text-left align-middle font-bold hidden md:table-cell">
                    View Todo
                </th>
            </tr>
        </thead>
    )
}

