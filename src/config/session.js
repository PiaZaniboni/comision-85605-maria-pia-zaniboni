import session from "express-session";
import MongoStore from "connect-mongo";

 export function createSessionMW () {
    const { SESSION_SECRET, MONGODB_URI, SESSION_TTL_SECONDS } = process.env;
    if ( !SESSION_SECRET ) { throw new Error("SESSION_SECRET is not defined in environment variables"); }

    const store = MongoStore.create({
        mongoUrl : MONGODB_URI,
        ttl : Number ( SESSION_TTL_SECONDS || 3600 ),
        autoRemove : 'interval',
        autoRemoveInterval : 10
    });

    return session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: Number ( SESSION_TTL_SECONDS || 3600 ),
            //secure: String (process.env.COOKIE_SECURE || 'false') === 'true'
        }
    })
}