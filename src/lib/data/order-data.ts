import 'server-only'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getUser } from '../auth/session'
import { db } from '@/database/db'



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