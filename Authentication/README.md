# For Encryption

Bcrypts js is used

## Routes Protection

Routes are protected using middleware checke /middleware/authMiddleware

### Csrf Token

For Csrf token ,csurf is used

#### Sharing same attributes over all views

app.use((req, res, next) => {
res.locals.isLoggedIn = req.user; // locals is object that is shared to all the views
res.locals.csrfToken = req.csrfToken();
next();
});
