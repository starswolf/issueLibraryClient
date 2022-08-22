export function handleRedirect(err, msg) {
    if (err && err.response) {
        if (err.response.status === 401) {
            window.location.href = '/login'
            return
        } else if ((err.response.data || {}).message) {
            throw err.response.data.message
        }
    }
    throw msg
}