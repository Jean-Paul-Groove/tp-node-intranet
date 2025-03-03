import { UserModel } from "../models/User.js"

export async function GetCurrent(req, res) {
    try {
        const { id } = req.session?.user
        if (id != null) {
            console.log(id)
        }
        const user = await UserModel.findById(id)
        const { firstname, lastname, photo } = user
        res.send({ firstname, lastname, photo, id })
    } catch (error) {
        res.statusCode = 404
        res.send({ error: error.message })
    }
}

export async function GetRandom(req, res) {
    try {
        const { id } = req.session?.user
        if (id != null) {
            throw new Error('Current user not found')
        }
        const user = await UserModel.aggregate().sample(1)
        
        const { password, ...rest} = user
        res.send({ rest})
    } catch (error) {
        res.statusCode = 404
        res.send({ error: error.message })
    }
}