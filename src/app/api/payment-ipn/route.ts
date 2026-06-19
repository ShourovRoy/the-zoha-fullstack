import { db } from "@/database/db";
import { cartTable } from "@/database/schemas/cart";
import { orderTable } from "@/database/schemas/order";
import { productTable } from "@/database/schemas/product";
import { transactionTable, TransactionValueType } from "@/database/schemas/transaction";
import { SSLCommerzePaymentNotification, SSLCommerzValidationResponse } from "@/lib/types/payment-notification-ssl-commerze"
import { and, eq, gte, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        // Correctly capture incoming x-www-form-urlencoded gateway form packets
        const formData = await request.formData()
        const payload = Object.fromEntries(formData.entries())

        const paymentNotificationData = payload as unknown as SSLCommerzePaymentNotification;

        // validate the IPN data from sslserver
        // validate the transaction
        const sslCommerzeValidationEndpoint = process.env.SSL_COMMERZE_VALIDATION_API_ENDPOINT || ""

        const queryParams = {
            val_id: paymentNotificationData.val_id || "",
            store_id: process.env.SSL_COMMERZE_STORE_ID || "",
            store_passwd: process.env.SSL_COMMERZE_API_SECRET_KEY || "",
            format: 'json'
        };

        const params = new URLSearchParams(queryParams)

        const validationUrl = `${sslCommerzeValidationEndpoint}?${params}`

        const res = await fetch(validationUrl, {
            method: "GET"
        })

        if (!res?.ok) {
            // error handle
            await db.update(orderTable).set({
                orderPaymentMethod: "ssl_commerze_gateway",
                orderProcessStatus: "processing",
                orderPaymentStatus: "due",
                orderPaymentMessage: "Payment Failed!"
            }).where(eq(orderTable.id, paymentNotificationData.tran_id))

            return new NextResponse("The payment has been failed!", { status: 400 })

        }

        const validationData: SSLCommerzValidationResponse = await res.json()


        // proceed with validated data

        // duplicate request abort
        if (validationData.status === "VALIDATED") {
            return new NextResponse("The payment already validated!", { status: 400 })
        }

        // create transaction details in db

        const transactionValue: TransactionValueType = {
            transactionId: validationData.tran_id || paymentNotificationData.tran_id,
            bankTranId: validationData.bank_tran_id || paymentNotificationData.bank_tran_id,
            orderId: validationData.tran_id || paymentNotificationData.tran_id,
            cardIssuer: validationData.card_issuer || paymentNotificationData.card_issuer,
            cardIssuerCountry: validationData.card_issuer_country || paymentNotificationData.card_issuer_country,
            cardNo: validationData.card_no || paymentNotificationData.card_no,
            cardType: validationData.card_type || paymentNotificationData.card_type,
            currency: validationData.currency || paymentNotificationData.currency,
            validation_id: validationData.val_id || paymentNotificationData.val_id,
            gatewayTransactionDate: validationData.tran_date || paymentNotificationData.tran_date,
            isValidationChecked: validationData.status === "VALID" ? true : false,
            gatewayStatus: paymentNotificationData.status,
            amount: validationData.amount || paymentNotificationData.amount,
            storeAmount: validationData.store_amount || paymentNotificationData.store_amount,
        }


        await db.insert(transactionTable).values(transactionValue).returning({
            id: transactionTable.id
        })



        await db.transaction(async (tx) => {


            // invalid transaction
            if (validationData.status === "INVALID_TRANSACTION") {

                switch (paymentNotificationData.status) {
                    case "FAILED":
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "failed",
                            orderPaymentStatus: "due",
                            orderPaymentMessage: "Transaction is declined by customer's Issuer Bank.",
                            orderPaymentChannel: paymentNotificationData.card_issuer,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                    case "CANCELLED":
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "cancelled",
                            orderPaymentStatus: "due",
                            orderPaymentMessage: "Transaction is cancelled by the customer.",
                            orderPaymentChannel: paymentNotificationData.card_issuer,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                    case "UNATTEMPTED":
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "unattempted",
                            orderPaymentStatus: "due",
                            orderPaymentMessage: "Customer did not choose to pay any channel.",
                            orderPaymentChannel: paymentNotificationData.card_issuer || null,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                    case "EXPIRED":
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "expired",
                            orderPaymentStatus: "due",
                            orderPaymentMessage: "Payment Timeout.",
                            orderPaymentChannel: paymentNotificationData.card_issuer || null,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                    default:
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "failed",
                            orderPaymentStatus: "due",
                            orderPaymentChannel: paymentNotificationData.card_issuer || "Scam Identified!",
                            orderPaymentMessage: "Transaction was failed!"
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                }

                return new NextResponse("Invalid transaction!", { status: 400 })

            }


            const orders = await tx.select().from(orderTable).where(
                and(eq(orderTable.id, paymentNotificationData.tran_id), eq(orderTable.totalAmount, paymentNotificationData.amount), eq(orderTable.totalAmount, validationData.amount), eq(orderTable.isCompleted, false))
            ).limit(1);

            if (!orders || orders.length === 0) {
                return new NextResponse("There are no orders!", { status: 400 })
            }

            if (paymentNotificationData.status === validationData.status) {

                switch (paymentNotificationData.status) {
                    case "VALID":
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "confirmed",
                            orderPaymentStatus: "paid",
                            orderPaymentMessage: "A successful transaction",
                            orderPaymentChannel: paymentNotificationData.card_issuer,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break


                    default:
                        await tx.update(orderTable).set({
                            orderPaymentMethod: "ssl_commerze_gateway",
                            orderProcessStatus: "error",
                            orderPaymentStatus: "due",
                            orderPaymentMessage: "Payment Failed!",
                            orderPaymentChannel: paymentNotificationData.card_issuer || null,
                        }).where(eq(orderTable.id, paymentNotificationData.tran_id))
                        break;
                }

                const carts = await tx.query.cartTable.findMany({
                    with: {
                        products: true
                    },
                    where: {
                        // NOTE: value_a consist of user id set from sslcommerze checkout session
                        userId: validationData.value_a
                    }
                })


                for (const cartItem of carts) {
                    if (!cartItem.productId) continue

                    const orderQuantity = cartItem.quantity

                    // update product stock quantity
                    const productQuantityUpdateRes = await tx.update(productTable).set({
                        quantity: sql`${productTable.quantity} - ${orderQuantity}`
                    }).where(and(
                        eq(productTable.id, cartItem.productId),
                        gte(productTable.quantity, orderQuantity!)
                    )).returning({
                        id: productTable.id
                    })


                    if (!productQuantityUpdateRes || productQuantityUpdateRes.length === 0) {
                        tx.rollback()
                        return {
                            errorMessage: `${cartItem.products?.name!} in your cart are no longer available in the requested quantity.`
                        }
                    }

                    // update product details cache by slug
                    revalidateTag(`productSlug-${cartItem.products?.slug!}`, "max")

                }


                // NOTE: value_a consist of user id set from sslcommerze checkout session
                // delete the cart table 
                await tx.delete(cartTable).where(eq(cartTable.userId, validationData.value_a))




            }


        })


        // Return an immediate 200 OK so SSLCommerze knows your server is alive
        return new NextResponse("Payment Notification Received", { status: 200 })
    } catch (err) {
        console.error("IPN Parse Error:", err)
        return new NextResponse("Bad Request Layout Structure", { status: 400 })
    }
}