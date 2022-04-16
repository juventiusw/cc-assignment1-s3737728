module.exports = (express, app) => {
    const controller = require('../controllers/image.controller.js');
    const router = express.Router();

    // Upload profile picture
    router.post("/uploadprofileimage", controller.profpic);

    // Delete an image
    router.post("/deleteimage", controller.delete);

    //Upload post image
    router.post("/uploadpostimage", controller.uploadimg);

    app.use("/api", router);

}