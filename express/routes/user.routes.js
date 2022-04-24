const controller = require("../controllers/user.controller");
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

    // Update a user.
    router.post("/updateprofile", controller.update);

    // Follow a user.
    router.post("/follow", controller.follow);

    // Unfollow a user.
    router.post("/unfollow", controller.unfollow);

    // Create a new user.
    router.post("/", controller.create);

    // Delete a user.
    router.post("/delete", controller.delete);

    // Block a user.
    router.post("/block/:userid", controller.block);

    // Unblock a user.
    router.post("/unblock/:userid", controller.unblock);

    // Delete user profpic
    router.post("/deleteprofpic/:userid", controller.deleteprofpic);

    app.use("/api/users", router);
}