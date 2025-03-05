export function isAdmin(req, res, next) {


if(req.user?.isAdmin){
    console.log("IS ADMIN GETS A PASS")
    next()
   return
}
const error = new Error("Unauthorized")
error.status = 401
throw error
}