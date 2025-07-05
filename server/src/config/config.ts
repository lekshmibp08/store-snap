import dotenv from 'dotenv';
dotenv.config();

interface IApp {
    PORT: string
    ENVIRONMENT: string
}

interface ICors {
    CLIENT_URL : string;
    ALLOWED_HEADERS : string[];
    ALLOWED_METHODS : string[];
    CREDENTIALS : boolean;
}

interface IJwtConfig {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
}



interface IMongodb{
    URI: string | undefined
}

interface IMailer{
    EMAIL_PASS : string;
    EMAIL_USER: string;
}

interface IConfig {
    app: IApp
    mongodb: IMongodb 
    cors: ICors
    jwt : IJwtConfig
    mailer: IMailer
}


export const config:IConfig = {
    app: {
        PORT: process.env.PORT || "4000",
        ENVIRONMENT : process.env.ENVIRONMENT || 'development'
    },
    mongodb:{
        URI: process.env.MONGODB_URL
    },
    cors: {
        CLIENT_URL: process.env.FRONT_END_URL || 'http://localhost:5173',
        ALLOWED_HEADERS : ['Content-Type', 'Authorization'],
        ALLOWED_METHODS : ["GET", "POST", "DELETE", "PUT","PATCH"],
        CREDENTIALS : true
    },

    jwt: {
        ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET || 'access secret',
        REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET || 'refresh secret',
    },
    mailer:{
        EMAIL_USER: process.env.EMAIL_USER!,
        EMAIL_PASS: process.env.EMAIL_PASS!
    }

}