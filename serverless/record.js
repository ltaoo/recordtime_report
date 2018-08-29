var TableStore = require('tablestore');
var getRawBody = require('raw-body');

var instanceName = 'recordtime';
var tableName = 'record';

function foo(ary) {
  const res = {};
  for (let i = 0, l = ary.length; i < l; i += 1) {
    const item = ary[i];
    res[item.columnName] = item.columnValue;
  }
  return res;
}
function formatResponse(res) {
  const { rows } = res;
  return rows.map(row => {
    const res = foo(row.attributes);
    const result = {
      id: row.primaryKey[0].value,
    };
    console.log(res);
    Object.keys(res).map(key => {
      const value = res[key];
      result[key] = value;
    })
    return result;
  });
}

exports.handler = function(request, response, context) {
  var creds = context.credentials;
  var client = new TableStore.Client({
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.accessKeySecret,
    stsToken: creds.securityToken,
    endpoint: 'http://' + instanceName + '.cn-hangzhou.ots.aliyuncs.com',
    instancename: instanceName,
  });
  // 根据 method 处理不同的请求
  const method = request.method;
  if (method === 'GET') {
    const startTime = request.queries.starttime;
    const endTime = request.queries.endtime;
    // 查询参数
    var params = {
      tableName,
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [
        {
          // id: TableStore.INF_MIN,
          id: startTime,
        },
      ],
      exclusiveEndPrimaryKey: [
        {
          // id: TableStore.INF_MAX,
          id: endTime,
        },
      ],
    };
    response.setHeader('content-type', 'application/json');
    client.getRange(params, function(err, data) {
      console.log(err, data);
      if (err) {
        response.send(JSON.stringify(err));
        return;
      }
      // 过滤出需要的数据
      response.send(JSON.stringify({ result: formatResponse(data) }));
    });
    return;
  }
  if (method === 'POST') {
    var currentTimeStamp = Date.now();
    getRawBody(request, (err, body) => {
      body = decodeURIComponent(body.toString());
      response.setHeader('content-type', 'application/json');
      if (err) {
        response.send('{"error": ' + JSON.stringify(err) + '}');
      }
      // response.send(body);
      try {
        body = JSON.parse(body);
      } catch (err) {
        response.send('{"err": ""}');
      }
      // response.send(body)
      var params = {
        tableName,
        condition: new TableStore.Condition(
          TableStore.RowExistenceExpectation.IGNORE,
          null,
        ),
        primaryKey: [{ id: String(currentTimeStamp) }],
        attributeColumns: [
          { starttime: body.starttime },
          { endtime: body.endtime },
          { content: body.content },
        ],
        returnContent: { returnType: TableStore.ReturnType.Primarykey },
      };

      client.putRow(params, function(err, data) {
        console.log(err, data);
        if (err) {
          response.send(JSON.stringify(err));
          return;
        }
        response.send(JSON.stringify(data));
      });
    });
    return;
  }
  if (method === 'DELETE') {
    return;
  }
  if (method === 'PUT') {
    return;
  }
};
