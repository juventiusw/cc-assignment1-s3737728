module.exports = (express, app) =>  {
    const controller = require("../controllers/reply.controller.js");
    const router = express.Router();

    // Select all replies.
    router.get("/", controller.all);

    // Create a new reply.
    router.post("/", controller.create);

    // Delete a reply.
    router.post("/delete/:replyid", controller.delete);

    // Update a reply.
    router.put("/update", controller.update);

    // Like a post.
    router.post("/like", controller.like);

    // Dislike a post.
    router.post("/dislike", controller.dislike);

    // Delete a like or dislike of a post.
    router.post("/deletelike", controller.deletelike);

    // Get the replyid of all replies from a user
    router.post("/userreplies", controller.userreplies);

    // Add routes to server.
    app.use("/api/replies", router);
}