import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
    try {
        if (req.session) {
            const { token } = req.session
            if (token) {
                const payload = jwt.verify(token, process.env.JWT_SECRET)
                if (payload) {
                    req.session.user = payload.user
                    next()
                    return
                }
            }
            req.session.destroy()
        }
        res.redirect('/login')
    } catch (error) {
        res.redirect('/login')
    }
}