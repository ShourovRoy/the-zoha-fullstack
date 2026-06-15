
import GlobalNavbar from "@/components/shared/global-navbar"
import { getUser } from "@/lib/auth/session"
import { ReactNode, Suspense } from "react"


const ApplicationLayout = ({ children }: {
    children: ReactNode
}) => {



    return (
        <div className="bg-stone-50 min-h-full">

            <GlobalNavbar />

            {children}
        </div>
    )
}

export default ApplicationLayout