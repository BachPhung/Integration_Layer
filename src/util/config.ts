import dotenv from 'dotenv'
dotenv.config()
let MONGODB_URI = process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI
let PORT = process.env.PORT;

type Config = {
    MONGODB_URI?:string,
    PORT?: string
}

const config:Config = {
    MONGODB_URI,
    PORT
}

export default config;