import { ReactNode } from 'react'

const loading = ({ children }: { children: ReactNode }) => {
    return (
        <div>{children}</div>
    )
}

export default loading