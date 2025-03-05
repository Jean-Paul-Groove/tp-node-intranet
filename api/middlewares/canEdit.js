export function canEdit(req, res, next) {
    try {
       const currentUser = req.user
       const idToEdit = req.params.id
       console.log(currentUser,idToEdit)
if(currentUser.id !=null || idToEdit != null){
    if(currentUser.isAdmin === true){
        console.log('OK')
        next()
        return
    }
if(currentUser.id === idToEdit){
    console.log('OK')

    next()
    return
}
throw new Error('Unauthorized')
}
    } catch (error) {
        res.status(401).send({error:error.message})

    }
}