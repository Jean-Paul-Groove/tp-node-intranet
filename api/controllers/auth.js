import { UserModel } from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// export async function SignUpController(req, res) {
//     try {
//         const { firstName, lastName, email, password, password_confirm } = req.body
//         const errors =[]
//         // INPUT CHECKS
//         // STRING
//         verifyStrings([firstName, lastName, email, password, password_confirm], errors)
//         // IDENTICAL PASSWORDS
//         if (password !== password_confirm) {
//             errors.push(`The 2 passwords aren't identical`)
//         }
//         // STRONG PASSWORD
//         if (!securityModule.passwordRegex.test(password)) {
//             errors.push("Your password must have 8 characters, 1 uppercase, 1 lowercase, 1 number and a special character")
//         }
//         // VALID EMAIL
//         if (!securityModule.emailRegex.test(email)) {
//             errors.push("Invalid email")
//         }
//         // UNIQUE EMAIL
//         const emailUsed = await UserModel.exists({ email })
//         if (emailUsed) {
//             errors.push("This email is already used")
//         }
//         // ERRORS FEEDBACK
//         if (errors.length > 0) {
//             req.flash("errors",[...errors])
//             req.flash('test','bababa')
//             res.redirect("/");
//         } else {
//             // SUCCESS FEEDBACK
//             const hashedPassword = securityModule.hash(password)
//             await UserModel.create({ firstName, lastName, email, password: hashedPassword })
//             req.flash('success',`Inscription réussie, bienvenue sur l'application ${firstName}`)
//             res.redirect('/')
//         }
//     } catch (err) {
//         res.redirect('/')
//     }
// }

export async function Login(req, res) {
    try {
        const { email, password } = req.body
        const errors = []
        console.log( req.body)
        verifyStrings([email, password], errors)
        const user = await UserModel.findOne({ email })
        
        if (errors.length > 0) {
            const error = new Error('Please enter text values.')
            error.status = 400
            throw error
        }
        if (!user) {
            const error = new Error('Incorrect credentials.')
            error.status = 401
            throw error
        }
       
        const validPassword = await  bcrypt.compare(password, user.password)
        if(!validPassword){
            const error = new Error('Incorrect credentials.')
            error.status = 401
            throw error
        }
        // ALL CHECKS PASSED, INIT SESSION AND TOKEN
        const token   = jwt.sign({user:{id:user.id,firstName:user.firstName, lastName:user.lastName}}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
        console.log(token)
        req.session.token = token
        res.statusCode = 200
        res.send({token})
    } catch (error) {
        if(error instanceof Error){
            res.status(error.status).send({error:error.message})
            console.log(res)
        }
    }
}

export function Disconnect(req,res){
    if(req.session){
        req.session.destroy()
    }
}
// Private helpers
function verifyStrings(stringArray, errorArray) {
    for (const string of stringArray) {
        if (typeof string !== 'string') {
            errorArray.push(`${string} must be of type string`)
        }
        if (string.trim() === '') {
            errorArray.push(`${string} can't be empty`)
        }
    }
}