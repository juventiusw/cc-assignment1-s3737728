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
        UpdateExpression: 'SET #fullname = :fullname, #username = :username, #email = :email, #password_hash = :hash, #datejoined = :datejoined',
        ConditionExpression: 'attribute_not_exists(userid)',
        ExpressionAttributeValues: {
            ':fullname': req.body.fullname,
            ':username': req.body.username,
            ':email': req.body.email,
            ':hash': hash,
            ':datejoined': req.body.datejoined
        },
        ExpressionAttributeNames: {
            '#fullname': 'fullname',
            '#username': 'username',
            '#email': 'email',
            '#password_hash': 'password_hash',
            '#datejoined': 'datejoined'
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

exports.update = async(req, res) => {
    const params = {
        TableName: 'user',
        Item: req.body
    };
    const user = await dynamo.dynamoClient.put(params).promise();
    res.json(user);
};