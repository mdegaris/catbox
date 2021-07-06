import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import session from "express-session";
import { Registration } from "./lib/forms/registration";
import { validate, ValidationType } from "./lib/forms/regValidator";
// import { AuthStatus, authenticate } from './lib/auth/login';
// import cookieParse from 'cookie-parser';

const sessionMiddleware = session({
    secret: "loki",
    cookie: { maxAge: 120000 },
    resave: true,
    saveUninitialized: true,
});

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.protocol}://${req.hostname}${req.originalUrl}`);
    console.log(`Req method: ${req.method}`);
    console.log(`Req Content-Type:  ${req.get("Content-Type")}`);
    console.log(`Resp Content-Type:  ${res.get("Content-Type")}`);
    next();
};

function addMiddleware(app: Express) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(logger);
}

function staticContent(app: Express) {
    app.use(express.static(path.join(__dirname, "public", "static")));
}

function registerPost(req: Request, res: Response) {
    const reg = Registration.buildFromHttpRequest(req);
    console.log(`New Registration: ${reg.toString()}`);

    reg.create()
        .then(() => {
            console.log("Registration success.");
            res.sendFile(path.join(__dirname, "public", "/main.html"));
        })
        .catch((err) => {
            console.log(err);
        });
}

function addRoutes(app: Express) {
    app.get("/", (_req, res) => {
        res.sendFile(path.join(__dirname, "public", "/main.html"));
    });

    /**
     * Registration route.
     */
    app.route("/register")
        .get((_req, res) => {
            res.render("main-template", { content: "register-content" });
        })
        .post((req, res) => {
            registerPost(req, res);
        });

    app.post("/validate-reg-dynamic", (req, res) => {
        validate(req, ValidationType.LITE).then((valErros) => {
            res.json(valErros);
        });
    });

    app.post("/validate-reg-full", (req, res) => {
        validate(req, ValidationType.FULL).then((valErros) => {
            res.json(valErros);
        });
    });

    app.route("/login").get((_req, res) => {
        // res.sendFile(path.join(__dirname, 'public', '/login.html'));
        res.render("main-template", { content: "login-content" });
    });
    // .post((req, res, next) => {

    //     authenticate(req)
    //         .then((authCode) => {
    //             switch (authCode) {
    //                 case AuthStatus.AUTH_SUCCESS:
    //                     next();
    //                     break;
    //                 case AuthStatus.BAD_PASSWORD:
    //                     console.log(`Bad password for ${loginAttempt.getEmail()}.`);
    //                     break;
    //                 case AuthStatus.NO_USER_ACCOUNT:
    //                     console.log(`${loginAttempt.getEmail()} has no user account.`);
    //                     break;
    //                 default:
    //                     console.log(`Unknown auth code: ${authCode}`);
    //             }
    //         })
    //         .catch((authErr) => {
    //             console.log(`Authentication error ${authErr.message}`);
    //         });
    // });
}

function setupRouter(app: Express): Express {
    addMiddleware(app);
    staticContent(app);
    addRoutes(app);

    return app;
}

export { setupRouter };
