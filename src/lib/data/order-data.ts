import 'server-only'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { deleteSession, getUser } from '../auth/session'
import { db } from '@/database/db'
import { redirect } from 'next/navigation'
import { usersTable } from '@/database/schemas/user'
import { and, eq } from 'drizzle-orm'



export async function getAllIncompletedOrders() {
    try {

        const user = await getUser(true)

        if (!user) return {
            errorMessage: "Please login!"
        }



        const userOrderDetails = await db.query.usersTable.findFirst({
            with: {
                orders: {
                    with: {
                        orderItems: true
                    }
                }
            },
            where: {
                id: user.userId,
                orders: {
                    isCompleted: false
                }
            }
        })






        return {
            userOrderDetails
        }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            userOrderDetails: null
        }
    }
}


// get all available order with confirming status admin
export async function getAllConfirmingInCompleteAvailableOrders() {
    try {
        // get user 
        const user = await getUser(false)

        if (user?.role !== "admin") {
            redirect("/")
        }

        const [userDetails] = await db.select().from(usersTable).where(and(eq(usersTable.id, user.userId), eq(usersTable.role, user.role))).limit(1)

        if (!userDetails) {
            // delete existing session and redirect to login
            await deleteSession()
        }


        const orders = await db.query.orderTable.findMany({
            with: {
                orderItems: true,
                user: true,
            },
            where: {
                orderProcessStatus: {
                    OR: ["confirming", "processing"]
                },
                isCompleted: {
                    eq: false
                }
            },
            orderBy: {
                created_at: "asc"
            }
        })

        return {
            orders
        }



    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            orders: []
        }
    }
}


// get only confiremd orders
export async function getAllConfirmedInCompleteOrders() {
    try {
        // get user 
        const user = await getUser(false)

        if (user?.role !== "admin") {
            redirect("/")
        }

        const [userDetails] = await db.select().from(usersTable).where(and(eq(usersTable.id, user.userId), eq(usersTable.role, user.role))).limit(1)

        if (!userDetails) {
            // delete existing session and redirect to login
            await deleteSession()
        }


        const orders = await db.query.orderTable.findMany({
            with: {
                orderItems: true,
                user: true,
            },
            where: {
                orderProcessStatus: {
                    eq: "confirmed"
                },
                isCompleted: {
                    eq: false
                }
            },
            orderBy: {
                created_at: "asc"
            }
        })

        return {
            orders
        }



    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            orders: []
        }
    }
}

// get all completed orders
export async function getAllCompletedOrders() {
    try {

        const userSession = await getUser(true)

        const userDetails = await db.select().from(usersTable).where(

            eq(usersTable.id, userSession?.userId!)

        ).limit(1)

        if (!userDetails || userDetails.length === 0) {
            await deleteSession()
            redirect("/auth/login")
        }

        // check role 
        if (userDetails[0].role !== "admin") {
            redirect("/")
        }


        const completedOrders = await db.query.orderTable.findMany({
            with: {
                orderItems: true,
                user: {
                    columns: {
                        password: false
                    }
                },
            },
            where: {
                isCompleted: {
                    eq: true
                },
            }
        })

        if (!completedOrders) {
            throw Error("Unable to get completed orders!")
        }

        return {
            completedOrders
        }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: String(error) || "Something went wrong! try again"
        }
    }
}

// get order details
export async function getOrderDetails(orderId: string) {
    try {
        const user = await getUser(true)

        // get user details
        const userDetails = await db.select().from(usersTable).where(and(eq(usersTable.id, user?.userId!), eq(usersTable.role, "admin")))

        if (!userDetails) {
            redirect("/")
        }


        const orderDetails = await db.query.orderTable.findFirst({
            with: {
                user: {
                    columns: {
                        password: false
                    }
                },
                orderItems: true
            },
            where: {
                id: {
                    eq: orderId
                }
            }
        })



        return {
            orderDetails
        }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: "Something went wrong!"
        }
    }
}