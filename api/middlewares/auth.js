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
        }
            const token = req.headers.authorization.split('Bearer ')[1]
          console.log(token)
          console.log(req.headers.authorization)
          
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            if (payload) {
                req.session.user = payload.user
                req.session.token = token
                next()
                return
            }
        
        throw new Error('Invalid token')
    } catch (error) {
        if(req.session){
            req.session.destroy()
        }
        res.status(401).send({error:error.message})

    }
}