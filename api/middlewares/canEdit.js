export function canEdit(req, res, next) {
    try {
        // GET USER AND ID TO EDIT
        const currentUser = req.user
        const idToEdit = req.params.id
        // PASS IF USER ADMIN OR EDITING ITSELF
        if (currentUser.id != null || idToEdit != null) {
            if (currentUser.isAdmin === true) {
                next()
                return
            }
            if (currentUser.id === idToEdit) {
                next()
                return
            }
            throw new Error('Unauthorized')
        }
    } catch (error) {
        res.status(401).send({ error: error.message })

    }
}