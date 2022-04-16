module.exports = (express, app) => {
    const controller = require('../controllers/user.controller.js');
    const router = express.Router();

    // Select all users.
    router.get("/", controller.all);

    // Select a single user with id.
    router.get("/select/:id", controller.one);

    // Select a single user with username.
    router.get("/selectusername/:username", controller.oneusername);

    // Select one user from the database if username and password are a match.
    router.post("/login", controller.login);

    router.post("/updateprofile", controller.update);

    // Create a new user.
    router.post("/", controller.create);

    app.use("/api/users", router);
}