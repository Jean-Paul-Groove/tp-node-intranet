export function isAdmin(req, res, next) {
    // PASS IF CURRENT USER IS ADMIN
    if (req.user?.isAdmin) {
        next()
        return
    }
    const error = new Error("Unauthorized")
    error.status = 401
    throw error
}