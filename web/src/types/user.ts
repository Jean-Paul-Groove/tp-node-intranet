export interface User {
    _id:string,
    firstname:string,
    lastname:string,
    birthdate:Date,
    email:string,
    phone:string,
    category:'Technique'|'Marketing'|'Client',
    city:string,
    country:string,
    photo:string,
    createdAt:Date,
    updatedAt:Date
}