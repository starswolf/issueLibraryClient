import { getCurrentUser } from "./auth.service";

export default function authHeader() {
    const user = getCurrentUser()

    if (user && user.accessToken) {
        return { 'x-access-token': user.accessToken }
    } else {
        return {}
    }
}
