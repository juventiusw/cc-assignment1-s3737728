const dynamo = require('../database/dynamo');
const bcrypt = require('bcryptjs');

exports.all = async (req, res) => {
    const params = {
        TableName: 'user',
    };
    try {
        const users = await dynamo.dynamoClient.scan(params).promise();
        console.log(users.Items);
        res.json(users.Items);
    }catch (err) {
        console.log(err);
    }
}

exports.one = async (req, res) => {
    const userid = req.params.id;
    const params = {
        TableName: 'user',
        Key: {
            userid
        }
    };
    try {
        const user = await dynamo.dynamoClient.get(params).promise();
        console.log(typeof user.Item);
        let state = typeof user.Item;
        if(state === "undefined") {
            res.json(null);
        }else {
            res.json(user.Item);
        }
    }catch (err) {
        console.log(err);
    }
}

exports.oneusername = async (req, res) => {
    console.log(req.params.username);
    const params = {
        TableName: 'user',
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': req.params.username
        }
    };
    try {
        const user = await dynamo.dynamoClient.scan(params).promise();
        let state = typeof user.Items[0];
        if(state === "undefined") {
            res.json(null);
        }else {
            res.json(user.Items[0]);
        }
    }catch (err) {
        console.log(err);
    }

}

exports.create = async(req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const params = {
        TableName: 'user',
        Key: {
          'userid': req.body.userid
        },
        UpdateExpression: 'SET fullname = :fullname, username = :username, email = :email, password_hash = :hash, datejoined = :datejoined, followers = :followers, following = :following, userStatus = :userStatus',
        ConditionExpression: 'attribute_not_exists(userid)',
        ExpressionAttributeValues: {
            ':fullname': req.body.fullname,
            ':username': req.body.username,
            ':email': req.body.email,
            ':hash': hash,
            ':datejoined': req.body.datejoined,
            ':followers': [],
            ':following': [],
            ':userStatus': true
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const user = await dynamo.dynamoClient.update(params).promise();
        res.json(user.Attributes);
    }catch (err) {
        console.log(err)
    }

};

exports.login = async (req, res) => {

    const params = {
        TableName: 'user',
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': req.body.username
        }
    };
    try {
        const user = await dynamo.dynamoClient.scan(params).promise();
        let state = typeof user.Items[0];
        if(state === "undefined") {
            // Login failed.
            res.json(null);
        }else {
            if(bcrypt.compareSync(req.body.password, user.Items[0].password_hash) === false || !user.Items[0].userStatus) {
                // Login failed.
                res.json(null);
            }else {
                res.json(user.Items[0]);
            }
        }
    }catch (err) {
        console.log(err);
    }
}

exports.update = async (req, res) => {
    let profpic = null;
    if (req.body.profpic) {
        profpic = req.body.profpic;
    }
    const params = {
        TableName: 'user',
        Key: {
            'userid': req.body.userid
        },
        UpdateExpression: 'SET profpic = :profpic, fullname = :fullname, username = :username, email = :email',
        ConditionExpression: 'attribute_exists(userid)',
        ExpressionAttributeValues: {
            ':profpic': profpic,
            ':fullname': req.body.fullname,
            ':username': req.body.username,
            ':email': req.body.email
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const user = await dynamo.dynamoClient.update(params).promise();
        res.json(user.Attributes);
    }catch (err) {
        console.log(err)
    }
}

exports.follow = async (req, res) => {
    const sourceData = {
        'userid': req.body.followeeid,
        'fullname': req.body.followeeFullname,
        'username': req.body.followeeUsername,
        'profpic': req.body.followeeProfpic
    }
    const sourceParams = {
        TableName: 'user',
        Key: {
            'userid': req.body.followerid
        },
        UpdateExpression: 'SET following = list_append(following, :followeeid)',
        ConditionExpression: 'attribute_exists(userid) AND NOT contains(following, :followeeidobj)',
        ExpressionAttributeValues: {
            ':followeeid': [ sourceData ],
            ':followeeidobj': sourceData
        }
    };
    const targetData = {
        'userid': req.body.followerid,
        'fullname': req.body.followerFullname,
        'username': req.body.followerUsername,
        'profpic': req.body.followerProfpic
    }
    const targetParams = {
        TableName: 'user',
        Key: {
            'userid': req.body.followeeid
        },
        UpdateExpression: 'SET followers = list_append(followers, :followerid)',
        ConditionExpression: 'attribute_exists(userid) AND NOT contains(followers, :followeridobj)',
        ExpressionAttributeValues: {
            ':followerid': [ targetData ],
            ':followeridobj': targetData
        }
    };
    try {
        await dynamo.dynamoClient.update(sourceParams).promise();
        await dynamo.dynamoClient.update(targetParams).promise();
        res.json({
            'followerid': req.body.followerid,
            'followeeid': req.body.followeeid
        });
    }catch (err) {
        console.log(err)
    }
}

exports.unfollow = async (req, res) => {
    const getSourceParams = {
        TableName: 'user',
        Key: {
            'userid': req.body.followerid
        }
    };
    const getTargetParams = {
        TableName: 'user',
        Key: {
            'userid': req.body.followeeid
        }
    };
    try {
        // Get the index first
        const sourceUser = await dynamo.dynamoClient.get(getSourceParams).promise();
        const mySourceIndex = sourceUser.Item.following.findIndex(i => i.userid === req.body.followeeid);
        const targetUser = await dynamo.dynamoClient.get(getTargetParams).promise();
        const myTargetIndex = targetUser.Item.followers.findIndex(i => i.userid === req.body.followerid);
        // Then delete element based on the index
        if((mySourceIndex || mySourceIndex === 0) && (myTargetIndex || myTargetIndex === 0)) {
            const deleteSourceParams = {
                TableName: 'user',
                Key: {
                    'userid': req.body.followerid
                },
                UpdateExpression: 'REMOVE following['+mySourceIndex+']',
                ConditionExpression: 'attribute_exists(userid)'
            }
            const deleteTargetParams = {
                TableName: 'user',
                Key: {
                    'userid': req.body.followeeid
                },
                UpdateExpression: 'REMOVE followers['+myTargetIndex+']',
                ConditionExpression: 'attribute_exists(userid)'
            }
            await dynamo.dynamoClient.update(deleteSourceParams).promise();
            await dynamo.dynamoClient.update(deleteTargetParams).promise();
            res.send({
                message: "Unfollowed."
            });
        }
    }catch (err) {
        console.log(err);
    }
}

exports.delete = async (req, res) => {
    const replyParams = {
        TableName: 'reply'
    };
    const postParams = {
        TableName: 'post'
    };
    const userParams = {
        TableName: 'user'
    }
    try {
        await deleteLikesOfReplies(req, replyParams);
        await deleteLikesOfPosts(req, postParams);
        await deleteUserFromFollow(req, userParams);
        await deleteRepliesOfPosts(req);
        await deleteRepliesOfUser(req);
        await deletePostsOfUser(req);
        // Delete the selected user
        const deleteParams = {
            TableName: 'user',
            Key: {
                'userid': req.body.id
            }
        }
        await dynamo.dynamoClient.delete(deleteParams).promise();
        res.send({
            status: true,
            message: "User Deleted."
        });
    }catch (err) {
        console.log(err);
    }
}

const deleteLikesOfReplies = async (req, replyParams) => {
    // Delete likes of replies belonging to the selected user
    try {
        const replies = await dynamo.dynamoClient.scan(replyParams).promise();
        const userLikingReplies = [];
        for (const reply of replies.Items) {
            reply.likes.forEach((x, i) => {
                if (x.userid === req.body.id) {
                    userLikingReplies.push({
                        'replyid': reply.replyid,
                        'index': i
                    });
                }
            });
        }
        for (const x of userLikingReplies) {
            const params = {
                TableName: 'reply',
                Key: {
                    replyid: x.replyid
                },
                UpdateExpression: 'REMOVE likes[' + x.index + ']',
                ConditionExpression: 'attribute_exists(replyid)'
            }
            await dynamo.dynamoClient.update(params).promise();
        }
    }catch (err) {
        console.log(err);
    }
}

const deleteLikesOfPosts = async (req, postParams) => {
    // Delete likes of posts belonging to the selected user
    try {
        const posts = await dynamo.dynamoClient.scan(postParams).promise();
        const userLikingPosts = [];
        for (const post of posts.Items) {
            post.likes.forEach((x, i) => {
                if (x.userid === req.body.id) {
                    userLikingPosts.push({
                        'postid': post.postid,
                        'index': i
                    });
                }
            });
        }
        for (const x of userLikingPosts) {
            const params = {
                TableName: 'post',
                Key: {
                    postid: x.postid
                },
                UpdateExpression: 'REMOVE likes[' + x.index + ']',
                ConditionExpression: 'attribute_exists(postid)'
            }
            await dynamo.dynamoClient.update(params).promise();
        }
    }catch (err) {
        console.log(err);
    }
}

const deleteUserFromFollow = async (req, userParams) => {
    // Delete all follow records of the selected user
    try {
        const users = await dynamo.dynamoClient.scan(userParams).promise();
        const userFollow = [];
        for (const user of users.Items) {
            const data = {};
            user.followers.forEach((x, i) => {
                if (x.userid === req.body.id) {
                    data['userid'] = user.userid;
                    data['followerIndex'] = i;
                }
            });
            user.following.forEach((x, i) => {
                if (x.userid === req.body.id) {
                    data['userid'] = user.userid;
                    data['followingIndex'] = i;
                }
            });
            if (Object.keys(data).length) {
                userFollow.push(data);
            }
        }
        for (const x of userFollow) {
            if (x.followerIndex || x.followerIndex === 0) {
                const params = {
                    TableName: 'user',
                    Key: {
                        userid: x.userid
                    },
                    UpdateExpression: 'REMOVE followers[' + x.followerIndex + ']',
                    ConditionExpression: 'attribute_exists(userid)'
                }
                await dynamo.dynamoClient.update(params).promise();
            }
            if (x.followingIndex || x.followingIndex === 0) {
                const params = {
                    TableName: 'user',
                    Key: {
                        userid: x.userid
                    },
                    UpdateExpression: 'REMOVE following[' + x.followingIndex + ']',
                    ConditionExpression: 'attribute_exists(userid)'
                }
                await dynamo.dynamoClient.update(params).promise();
            }
        }
    }catch (err) {
        console.log(err);
    }
}

const deleteRepliesOfPosts = async (req) => {
    // delete all the replies that are associated with all the posts that belong to the selected user
    try {
        for (const postid of req.body.postid) {
            const getParams = {
                TableName: 'reply',
                FilterExpression: 'postid = :postid',
                ExpressionAttributeValues: {
                    ':postid': postid
                }
            }
            const replies = await dynamo.dynamoClient.scan(getParams).promise();
            for (const reply of replies.Items) {
                const deleteParams = {
                    TableName: 'reply',
                    Key: {
                        'replyid': reply['replyid']
                    }
                }
                await dynamo.dynamoClient.delete(deleteParams).promise();
            }
        }
    }catch (err) {
        console.log(err);
    }
}

const deleteRepliesOfUser = async (req) => {
    // Delete all replies of the selected user
    try {
        const getParams = {
            TableName: 'reply',
            FilterExpression: 'userid = :userid',
            ExpressionAttributeValues: {
                ':userid': req.body.id
            }
        }
        const replies = await dynamo.dynamoClient.scan(getParams).promise();
        for (const reply of replies.Items) {
            const deleteParams = {
                TableName: 'reply',
                Key: {
                    'replyid': reply['replyid']
                }
            }
            await dynamo.dynamoClient.delete(deleteParams).promise();
        }
    }catch (err) {
        console.log(err);
    }
}

const deletePostsOfUser = async (req) => {
    try {
        for (const postid of req.body.postid) {
            const deleteParams = {
                TableName: 'post',
                Key: {
                    'postid': postid
                }
            }
            await dynamo.dynamoClient.delete(deleteParams).promise();
        }
    }catch (err) {
        console.log(err);
    }
}

// Block a user.
exports.block = async (req, res) => {
    const params = {
        TableName: 'user',
        Key: {
            'userid': req.params.userid
        },
        UpdateExpression: 'SET userStatus = :userStatus',
        ConditionExpression: 'attribute_exists(userid)',
        ExpressionAttributeValues: {
            ':userStatus': false
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.json({
            message: "User blocked."
        });
    }catch (err) {
        console.log(err)
    }
}

// Unblock a user.
exports.unblock = async (req, res) => {
    const params = {
        TableName: 'user',
        Key: {
            'userid': req.params.userid
        },
        UpdateExpression: 'SET userStatus = :userStatus',
        ConditionExpression: 'attribute_exists(userid)',
        ExpressionAttributeValues: {
            ':userStatus': true
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.json({
            message: "User unblocked."
        });
    }catch (err) {
        console.log(err)
    }
}

// Delete user profpic.
exports.deleteprofpic = async (req, res) => {
    const params = {
        TableName: 'user',
        Key: {
            'userid': req.params.userid
        },
        UpdateExpression: 'SET profpic = :profpic',
        ConditionExpression: 'attribute_exists(userid)',
        ExpressionAttributeValues: {
            ':profpic': null
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        await dynamo.dynamoClient.update(params).promise();
        res.json({
            message: "User unblocked."
        });
    }catch (err) {
        console.log(err)
    }
}
