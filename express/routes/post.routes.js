const controller = require("../controllers/post.controller");
module.exports = (express, app) => {
    const controller = require("../controllers/post.controller.js");
    const router = express.Router();

    // Select all posts.
    router.get("/", controller.all);

    // Create a new post.
    router.post("/", controller.create);

    // Delete a post.
    router.post("/delete/:postid", controller.delete);

    // Admin delete a post.
    router.post("/admindelete/:postid", controller.admindelete);

    // Update a post.
    router.put("/update", controller.update);

    // Like a post.
    router.post("/like", controller.like);

    // Dislike a post.
    router.post("/dislike", controller.dislike);

    // Delete a like or dislike of a post.
    router.post("/deletelike", controller.deletelike);

    // Get the postdata of all posts from a user
    router.get("/userposts/:id", controller.userposts);

    // Add routes to server.
    app.use("/api/posts", router);
};
