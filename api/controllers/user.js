import { UserModel } from "../models/User.js"
import bcrypt from 'bcrypt'

export async function GetCurrentUser(req, res) {
    try {
        // GET CURRENT USER ID
        const { id } = req?.user
        if (id == null) {
            throw new Error('Please provide a user Id')
        }
        // RETRIEVE USER
        const doc = await UserModel.findById(id)
        // REMOVE PASSWORD
        const { password, ...rest } = doc._doc
        res.send(rest)
    } catch (error) {
        res.statusCode = 404
        res.send({ error: error.message })
    }
}
export async function GetUser(req, res) {
    try {
        // GET USER ID
        const { id } = req.params
        if (id == null) {
            const error = new Error('Please provide a valid user Id')
            throw error
        }
        // RETRIEVE USER
        const doc = await UserModel.findById(id)
        // REMOVE PASSWORD
        const { password, ...rest } = doc._doc
        res.send(rest)
    } catch (error) {
        res.statusCode = error.status ?? 404
        res.send({ error: error.message })
    }
}
export async function GetRandomUser(req, res) {
    try {
        // GET CURRENT USER ID
        const { id } = req?.user
        if (id == null) {
            throw new Error('Current user not found')
        }
        // FETCH RANDOM USER DIFFERENT FROM CURRENT
        const user = await UserModel.aggregate({ $match: { id: { $not: id } } }).sample(1)
        // REMOVE PASSWORD
        const { password, ...rest } = user[0]
        res.send(rest)
    } catch (error) {
        res.statusCode = error.status ?? 404
        res.send({ error: error.message })
    }
}
export async function SearchUsers(req, res) {
    try {
        const { options, pagination } = req.body
        const { page, size } = validatePagination(pagination)
        const findQuery = {}
        // BUILD QUERY
        if (options != null) {
            const { category, search } = options
            // ADD CATEGORY TO FILTER
            if (category && category !== 'none') {
                findQuery.category = category
            }
            // ADD SEARCH TO FILTER ON PREDEFINED FIELDS
            if (search != null && typeof search ==='string' && search.trim().length>0) {
                const searchRegexp = new RegExp(search, 'i')
                findQuery.$or = []
                for (const field of searchFields) {
                    findQuery.$or.push({ [field]: searchRegexp })
                }
            }
        }
        // FETCH USERS WITHOUT PASSWORD AND TOTAL NUMBER FOR PAGINATION
        const users = await UserModel.find(findQuery, { password: 0 }).limit(size).skip((page - 1) * size).sort('createdAt')
        const total = await UserModel.find(findQuery).countDocuments()
        if (!users) {
            const error = new Error('Could not get users')
            error.status = 404
            throw error
        }
        res.send({ users, total })
    } catch (error) {
        res.statusCode = error.status ?? 404
        res.send({ error: error.message })
    }

}
export async function Create(req, res) {
    try {
        // VALIDATION 
        const { firstname, lastname, gender, category, email, phone, birthdate, city, country, photo, password, isAdmin } = req.body
        validateStrings([firstname, lastname, email, phone, city, country])
        validateGender(gender)
        validateCategory(category)
        validateEmail(email)
        validatePhoto(photo)
        validateDate(birthdate)
        validatePassword(password)
        if (! typeof isAdmin === 'boolean') {
            const error = new Error('Bad request: check isAdmin field')
            error.status = 400
            throw error
        }
        // BUILD USER BODY
        const body = { firstname, lastname, gender, category, email, phone, birthdate, city, country, photo, password, isAdmin }

        // HASH PASSWORD
        const newPassword = await Promise.resolve(bcrypt.hash(password, salt))
        body.password = newPassword
        // CREATE USER
        const result = await UserModel.create(body)
        // REMOVE PASSWORD
        const {password:hidden, ...user} = result._doc
        res.statusCode = 201
        res.send(user)
    } catch (error) {
        res.statusCode = error.status ?? 500
        res.send({ error: error.message ?? 'Please try again in a moment' })
    }
}
export async function Update(req, res) {
    try {
        // VALIDATION 
        const { id } = req.params
        if (id == null) {
            const error = new Error('Please provide a valid user Id')
            error.status = 400
            throw error
        }
        const { firstname, lastname, gender, category, email, phone, birthdate, city, country, photo, password, isAdmin } = req.body
        validateStrings([firstname, lastname, email, phone, city, country])
        validateGender(gender)
        validateCategory(category)
        validateEmail(email)
        validatePhoto(photo)
        validateDate(birthdate)
        // VALIDATE PASSWORD IF PRESENT
        if (password) {
            validatePassword(password)
        }
        // BUILD THE BODY
        const body = { firstname, lastname, gender, category, email, phone, birthdate, city, country, photo }


        // PASSWORD IF NEW ONE PROVIDED
        if (password) {
            const newPassword = await Promise.resolve(bcrypt.hash(password, salt))
            body.password = newPassword
        }

        // ADD ISADMIN TO BODY ONLY IF CURRENT USER IS ADMIN
        if (req.user?.isAdmin && typeof isAdmin === 'boolean') {
            body.isAdmin = isAdmin
        }

        // UPDATE
        await UserModel.findByIdAndUpdate(id, body)
        // REMOVE PASSWORD
        delete body.password
        body.id = id
        res.send(body)
    } catch (error) {
        res.statusCode = error.status ?? 404
        res.send({ error: error.message ?? 'User not found' })
    }
}
export async function Delete(req, res) {
    try {
        // GET ID
        const { id } = req.params
        if (id == null) {
            const error = new Error('Please provide a valid user Id')
            error.status = 400
            throw error
        }
        // DELETE
        await UserModel.findByIdAndDelete(id)
        res.statusCode = 204
        res.send()
    } catch (error) {
        res.statusCode = error.status ?? 404
        res.send({ error: error.message ?? 'Could not delete user' })

    }
}

// Constants
const defaultPagination = { page: 1, size: 10 }
const searchFields = ['firstname', 'lastname', 'city', 'category', 'phone', 'email']
const genders = ['male', 'female', 'other']
const categories = ['Marketing', 'Client', 'Technique']
const emailRegex = /^[A-zÀ-ÿ\-.]+@([\w-]+\.)+[\w-]{2,4}$/
const salt = bcrypt.genSaltSync(10)
// Helpers
function validatePagination(pagination) {

    if (pagination == null) {
        return defaultPagination
    }
    if (!Number(pagination.page) || !Number(pagination.size)) {
        const error = new Error('The pagination is incorrect, page and size must be numbers')
        error.status = 400
        throw error
    }
    const { page, size } = pagination
    if (page < 1 || size < 1) {
        const error = new Error('The pagination is incorrect, page and size can not be < 1')
        error.status = 400
        throw error
    }
    return { page, size }

}
function validateStrings(stringArray) {
    for (const string of stringArray) {
        if (typeof string !== 'string' || string.trim() === '') {
            const error = new Error('Bad request: check your string fields')
            error.status = 400
            throw error
        }

    }
}
function validateGender(gender) {
    if (typeof gender != 'string' || !genders.includes(gender)) {
        const error = new Error("Bad request: check gender field")
        error.status = 400
        throw error
    }
}
function validateCategory(category) {
    if (typeof category != 'string' || !categories.includes(category)) {
        const error = new Error("Bad request: check category field")
        error.status = 400
        throw error
    }
}
function validatePhoto(photo) {
    if (!photo) {
        return
    }
    if (typeof photo !== 'string' || (photo.length > 0 && photo.trim('') === '')) {
        const error = new Error("Bad request: check photo field")
        error.status = 400
        throw error
    }
}
function validatePassword(password) {
    if (password && typeof password === 'string' && password.trim().length >= 8) {
        return
    }
    const error = new Error('"Bad request: check password field')
    error.status = 400
    throw errror
}
function validateEmail(email) {
    if (!emailRegex.test(email)) {
        const error = new Error("Bad request: check email field")
        error.status = 400
        throw error
    }
}
function validateDate(date) {
    const testDate = new Date(date)
    if (testDate.valueOf() === NaN || testDate.getTime() > Date.now()) {
        const error = new Error('Bad request: check the date field')
        error.status = 400
        throw error
    }
}
