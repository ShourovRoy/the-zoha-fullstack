import { ReactNode } from "react"


const ApplicationLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div className="bg-stone-50 min-h-full">

            {children}
        </div>
    )
}

export default ApplicationLayout