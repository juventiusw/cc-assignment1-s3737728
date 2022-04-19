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
        UpdateExpression: 'SET fullname = :fullname, username = :username, email = :email, password_hash = :hash, datejoined = :datejoined, followers = :followers, following = :following',
        ConditionExpression: 'attribute_not_exists(userid)',
        ExpressionAttributeValues: {
            ':fullname': req.body.fullname,
            ':username': req.body.username,
            ':email': req.body.email,
            ':hash': hash,
            ':datejoined': req.body.datejoined,
            ':followers': [],
            ':following': []
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
            if(bcrypt.compareSync(req.body.password, user.Items[0].password_hash) === false) {
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
    const params = {
        TableName: 'user',
        Key: {
            'userid': req.body.userid
        },
        UpdateExpression: 'SET profpic = :profpic, fullname = :fullname, username = :username, email = :email',
        ConditionExpression: 'attribute_exists(userid)',
        ExpressionAttributeValues: {
            ':profpic': req.body.profpic,
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
        'username': req.body.followeeUsername
    }
    const sourceParams = {
        TableName: 'user',
        Key: {
            'userid': req.body.followerid
        },
        UpdateExpression: 'SET following = list_append(following, :followeeid)',
        ConditionExpression: 'attribute_exists(userid) AND NOT contains(followers, :followeeidobj)',
        ExpressionAttributeValues: {
            ':followeeid': [ sourceData ],
            ':followeeidobj': sourceData
        }
    };
    const targetData = {
        'userid': req.body.followerid,
        'fullname': req.body.followerFullname,
        'username': req.body.followerUsername
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