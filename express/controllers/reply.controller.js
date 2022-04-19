const dynamo = require('../database/dynamo');

// Select all replies from the database.
exports.all = async (req, res) => {
    const params = {
        TableName: 'reply',
    };
    try {
        const replies = await dynamo.dynamoClient.scan(params).promise();
        console.log(replies.Items);
        res.json(replies.Items);
    }catch (err) {
        console.log(err);
    }
}

// Create a reply in the database.
exports.create = async (req, res) => {
    const params = {
        TableName: 'reply',
        Key: {
            'replyid': 'r' + Date.now() + Math.random()
        },
        UpdateExpression: 'SET replyContent = :replyContent, userid = :userid, postid = :postid, likes = :likes',
        ConditionExpression: 'attribute_not_exists(replyid)',
        ExpressionAttributeValues: {
            ':replyContent': req.body['replyContent'],
            ':userid': req.body.userid,
            ':postid': req.body.postid,
            ':likes': []
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const reply = await dynamo.dynamoClient.update(params).promise();
        res.json(reply.Attributes);
    }catch (err) {
        console.log(err)
    }
}

// Delete a reply in the database.
exports.delete = async(req, res) => {
    const params = {
        TableName: 'reply',
        Key: {
            'replyid': req.body.replyid
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

// Update a reply in the database.
exports.update = async(req, res) => {
    const params = {
        TableName: 'reply',
        Key: {
            'replyid': req.body.replyid
        },
        UpdateExpression: 'SET replyContent = :replyContent',
        ConditionExpression: 'attribute_exists(replyid)',
        ExpressionAttributeValues: {
            ':replyContent': req.body['replyContent']
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const reply = await dynamo.dynamoClient.update(params).promise();
        res.json(reply.Attributes);
    }catch (err) {
        console.log(err)
    }
}

// Like a reply.
exports.like = async (req, res) => {
    const data = {
        userid: req.body.userid,
        choice: true
    }
    const params = {
        TableName: 'reply',
        Key: {
            'replyid': req.body.replyid
        },
        UpdateExpression: 'SET likes = list_append(likes, :data)',
        ConditionExpression: 'attribute_exists(replyid) AND NOT contains(likes, :dataobj)',
        ExpressionAttributeValues: {
            ':data': [ data ],
            ':dataobj': data
        }
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.send({
            message: "Reply Liked!"
        });
    }catch (err) {
        console.log(err)
    }
}

// Dislike a reply.
exports.dislike = async (req, res) => {
    const data = {
        userid: req.body.userid,
        choice: false
    }
    const params = {
        TableName: 'reply',
        Key: {
            'replyid': req.body.replyid
        },
        UpdateExpression: 'SET likes = list_append(likes, :data)',
        ConditionExpression: 'attribute_exists(replyid) AND NOT contains(likes, :dataobj)',
        ExpressionAttributeValues: {
            ':data': [ data ],
            ':dataobj': data
        }
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.send({
            message: "Reply Liked!"
        });
    }catch (err) {
        console.log(err)
    }
}

// Delete a like or dislike of a reply.
exports.deletelike = async (req, res) => {
    const getParams = {
        TableName: 'reply',
        Key: {
            'replyid': req.body.replyid
        }
    };
    try {
        // Get the index first
        const reply = await dynamo.dynamoClient.get(getParams).promise();
        const myIndex = reply.Item.likes.findIndex(i => i.userid === req.body.userid);
        // Then delete element based on the index
        if(myIndex || myIndex === 0) {
            const deleteParams = {
                TableName: 'reply',
                Key: {
                    'replyid': req.body.replyid
                },
                UpdateExpression: 'REMOVE likes['+myIndex+']',
                ConditionExpression: 'attribute_exists(replyid)'
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

// Get all replies that are associated with a number of posts
exports.userreplies = async (req, res) => {
    let obj = {};
    req.body.postid.forEach( (x, i) => {
        const key = ":postid" + i;
        obj[key.toString()] = x;
    });
    const params = {
        TableName: 'reply',
        FilterExpression: 'postid IN ('+Object.keys(obj).toString()+')',
        ExpressionAttributeValues: {
            obj
        }
    };
    try {
        const replies = await dynamo.dynamoClient.scan(params).promise();
        res.json(replies.Items);
    }catch (err) {
        console.log(err);
    }
}