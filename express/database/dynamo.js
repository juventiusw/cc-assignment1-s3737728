const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
})

exports.dynamoClient = new AWS.DynamoDB.DocumentClient();