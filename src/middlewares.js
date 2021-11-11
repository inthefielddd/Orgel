export const localsMiddleware = (res, req, next) => {
    console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Orgel";
    console.log(res.locals);
    next();
};
