import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
    try {
       // IF TOKEN SET USER IN REQ
        if(req.headers.authorization){
            const token = req.headers.authorization.split('Bearer ')[1]
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            if (payload) {
                req.user = payload.user
                next()
                return
            }
        }
        throw new Error('Invalid token')
    } catch (error) {
        res.status(401).send({error:error.message})

    }
}