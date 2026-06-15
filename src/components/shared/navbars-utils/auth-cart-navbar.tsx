import { getUser, SessionPayload } from "@/lib/auth/session"
import DynamicNavLinks from "./dynamic-nav-links"
import { getCartItemNumber } from "@/lib/data/cart-data";

const AuthCartNavbar = async () => {
    let user: SessionPayload | null | undefined = null;
    let cartCount = 0;

    try {
        // Securely fetch dynamic user cookies details
        user = await getUser(false)
        if (user) {
            cartCount = (await getCartItemNumber(user.userId)).cartCount
        }
    } catch (error) {
        // Fail quietly for guest navigation view modes
        user = null;
        cartCount = 0;
    }

    return <DynamicNavLinks user={user} cartCount={cartCount} />
}

export default AuthCartNavbar