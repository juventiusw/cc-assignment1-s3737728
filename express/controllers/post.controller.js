const dynamo = require('../database/dynamo');

// Select all posts from the database.
exports.all = async (req, res) => {
    const params = {
        TableName: 'post',
    };
    try {
        const posts = await dynamo.dynamoClient.scan(params).promise();
        console.log(posts.Items);
        res.json(posts.Items);
    }catch (err) {
        console.log(err);
    }
}

// Create a post in the database.
exports.create = async (req, res) => {
    const params = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        },
        UpdateExpression: 'SET postContent = :postContent, postImage = :postImage, userid = :userid, likes = :likes',
        ConditionExpression: 'attribute_not_exists(postid)',
        ExpressionAttributeValues: {
            ':postContent': req.body.content,
            ':postImage': req.body.postImage,
            ':userid': req.body.userid,
            ':likes': []
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const post = await dynamo.dynamoClient.update(params).promise();
        res.json(post.Attributes);
    }catch (err) {
        console.log(err)
    }
}

// Delete a post in the database.
exports.delete = async(req, res) => {
    const params = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        }
    };
    try {
        await dynamo.dynamoClient.delete(params).promise();
        res.send({
            message: "Post deleted."
        });
    }catch (err) {
        console.log(err);
    }
}

// Update a post in the database.
exports.update = async(req, res) => {
    const params = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        },
        UpdateExpression: 'SET postContent = :postContent',
        ConditionExpression: 'attribute_exists(postid)',
        ExpressionAttributeValues: {
            ':postContent': req.body.content
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const post = await dynamo.dynamoClient.update(params).promise();
        res.json(post.Attributes);
    }catch (err) {
        console.log(err)
    }
}

// Like a post.
exports.like = async (req, res) => {
    const data = {
        userid: req.body.userid,
        choice: true
    }
    const params = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        },
        UpdateExpression: 'SET likes = list_append(likes, :data)',
        ConditionExpression: 'attribute_exists(postid) AND NOT contains(likes, :dataobj)',
        ExpressionAttributeValues: {
            ':data': [ data ],
            ':dataobj': data
        }
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.send({
            message: "Post Liked!"
        });
    }catch (err) {
        console.log(err)
    }
}

// Dislike a post.
exports.dislike = async (req, res) => {
    const data = {
        userid: req.body.userid,
        choice: false
    }
    const params = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        },
        UpdateExpression: 'SET likes = list_append(likes, :data)',
        ConditionExpression: 'attribute_exists(postid) AND NOT contains(likes, :dataobj)',
        ExpressionAttributeValues: {
            ':data': [ data ],
            ':dataobj': data
        }
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.send({
            message: "Post Liked!"
        });
    }catch (err) {
        console.log(err)
    }
}

// Delete a like or dislike of a post.
exports.deletelike = async (req, res) => {
    const getParams = {
        TableName: 'post',
        Key: {
            'postid': req.body.postid
        }
    };
    try {
        // Get the index first
        const post = await dynamo.dynamoClient.get(getParams).promise();
        const myIndex = post.Item.likes.findIndex(i => i.userid === req.body.userid);
        // Then delete element based on the index
        if(myIndex || myIndex === 0) {
            const deleteParams = {
                TableName: 'post',
                Key: {
                    'postid': req.body.postid
                },
                UpdateExpression: 'REMOVE likes[:index]',
                ConditionExpression: 'attribute_exists(postid)',
                ExpressionAttributeValues: {
                    ':index': myIndex
                }
            }
            await dynamo.dynamoClient.update(deleteParams).promise();
            res.send({
                message: "Deleted."
            });
        }
    }catch (err) {
        console.log(err);
    }
}

// Get all posts created by a user
exports.userposts = async (req, res) => {
    const params = {
        TableName: 'post',
        FilterExpression: 'userid = :userid',
        ExpressionAttributeValues: {
            ':userid': req.params.id
        }
    };
    try {
        const users = await dynamo.dynamoClient.scan(params).promise();
        res.json(users.Items);
    }catch (err) {
        console.log(err);
    }
}