export interface User {
    _id:string,
    firstname:string,
    lastname:string,
    gender:string,
    birthdate:Date,
    email:string,
    phone:string,
    city:string,
    country:string,
    photo?:string,
    category:'Technique'|'Marketing'|'Client',
    isAdmin:boolean
    createdAt:Date,
    updatedAt:Date
}