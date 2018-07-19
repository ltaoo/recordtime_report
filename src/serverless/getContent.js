'use strict';

var TableStore = require('tablestore');
var getRawBody = require('raw-body');

var instanceName = 'recordtime';
var tableName = 'record';

const baseresponse = {
    isBase64Encoded: false,
    statusCode: 200
};

module.exports.handler = function(request, response, context) {
    const starttime = request.queries.starttime;
    const endtime = request.queries.endtime;
    var creds = context.credentials;
    var client = new TableStore.Client({
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.accessKeySecret,
        stsToken: creds.securityToken,
        endpoint: 'http://' + instanceName + '.cn-hangzhou.ots.aliyuncs.com',
        instancename: instanceName,
    });
    // 查询参数
    var params = {
        tableName,
        direction: TableStore.Direction.FORWARD,
        inclusiveStartPrimaryKey: [
          {
            "id": starttime,
          },
        ],
        exclusiveEndPrimaryKey: [
          {
            "id": endtime,
          },
        ],
    };
    response.setHeader('content-type', 'application/json');
    client.getRange(params, function(err, data) {
        if (err) {
            response.send(JSON.stringify(err));
            return;
        }
        response.send(JSON.stringify(data))
    });
};