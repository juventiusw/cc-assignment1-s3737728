module.exports = (express, app) => {
    const controller = require('../controllers/user.controller.js');
    const router = express.Router();

    // Select all users.
    router.get("/", controller.all);

    // Select a single user with id.
    router.get("/select/:id", controller.one);

    // Select a single user with username.
    router.get("/selectusername/:username", controller.oneusername);

    // Create a new user.
    router.post("/", controller.create);

    app.use("/api/users", router);
}