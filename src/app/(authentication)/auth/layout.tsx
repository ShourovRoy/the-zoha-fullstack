import { ReactNode } from "react"

const AuthLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <section>
            {children}
        </section>
    )
}

export default AuthLayout