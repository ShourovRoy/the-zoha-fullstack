import 'server-only'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getUser } from '../auth/session'
import { db } from '@/database/db'
import { redirect } from 'next/navigation'

// get all the trackers 
export async function getAllActiveTracker() {
    try {
        const userSession = await getUser()

        const userDetails = await db.query.usersTable.findFirst({
            columns: {
                password: false,
            },
            where: {
                id: {
                    eq: userSession?.userId,
                },

            }
        })

        if (userDetails?.role !== "admin") {
            redirect("/")
        }


        const orderTrackers = await db.query.orderTrackerTable.findMany({
            with: {
                order: {
                    with: {
                        user: {
                            columns: {
                                password: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })

        if (!orderTrackers) {
            throw Error("Unable to get the trackers")
        }

        return {
            orderTrackers
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: String(error) || "Something went wrong!"
        }
    }
}


// get order tracker details
export async function getOrderTrackerDetails(trackingId: string, adminOnly: boolean) {
    try {
        const userSession = await getUser()

        const userDetails = await db.query.usersTable.findFirst({
            columns: {
                password: false,
            },
            where: {
                id: {
                    eq: userSession?.userId,
                },

            }
        })


        if (adminOnly) {
            if (userDetails?.role !== "admin") {
                redirect("/")
            }
        }


        const orderTracker = await db.query.orderTrackerTable.findFirst({
            with: {
                order: {
                    with: {
                        user: {
                            columns: {
                                password: false
                            }
                        }
                    }
                }
            },
            where: {
                id: {
                    eq: trackingId
                }
            }
        })

        if (!orderTracker) {
            throw Error("Unable to get the tracker")
        }

        return {
            orderTracker
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: String(error) || "Something went wrong!"
        }
    }
}