import express, { Express } from 'express';
import path from 'path';
import session from 'express-session';
import { Registration } from './lib/forms/registration';
import { AuthStatus, authenticate } from './lib/auth/login';
// import cookieParse from 'cookie-parser';

const sessionMiddleware = session({
    secret: 'loki',
    cookie: { maxAge: 120000 },
    resave: true,
    saveUninitialized: true
});

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

function addMiddleware(app: Express) {
    app.use(logger);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
}

function staticContent(app: Express) {
    app.use(express.static(path.join(__dirname, 'public', 'static')));
}


function addRoutes(app: Express) {

    app.get('/', (_req, res) => {
        res.sendFile(path.join(__dirname, 'public', '/main.html'));
    });


    app.route('/register')
        .get((_req, res) => {
            // res.sendFile(path.join(__dirname, 'public', '/register.html'));
            // res.render('register', {message: 'test message'});
            res.render('main-template', {content: 'register-content'});
        })
        .post((req, res) => {

            const reg = Registration.buildFromHttpRequest(req);
            console.log(`New Registration: ${reg.toString()}`);

            reg.create()
                .then(() => {
                    console.log('Registration success.');
                    res.sendFile(path.join(__dirname, 'public', '/main.html'));
                })
                .catch((err) => {
                    console.log(err);
                });
        });


    app.route('/login')
        .get((_req, res) => {
            // res.sendFile(path.join(__dirname, 'public', '/login.html'));
            res.render('main-template', {content: 'login-content'});
        })
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