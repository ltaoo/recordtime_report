/**
 * @file 增删改查
 * @author wuya
 */
const app = require('fc-koa2-helper');
const TableStore = require('tablestore');
const Long = TableStore.Long;

/**
 * 连接数据库
 * @param {*} context 
 * @return {Client} - 数据库实例
 */
async function connect(context) {
  return new TableStore.Client({
    accessKeyId: context.credentials.accessKeyId,
    secretAccessKey: context.credentials.accessKeySecret,
    stsToken: context.credentials.securityToken,
    endpoint: process.env['Endpoint'],
    instancename: process.env['InstanceName'],
  });
}

/**
 * 查询数据
 * @param {*} client 
 */
async function fetch(client) {
  const params = {
    tableName: process.env['TableName'],
    primaryKey: [{ count_name: 'views' }],
    maxVersions: 1,
  };

  const response = await client.getRow(params);
  const row = response.row;

  if (row && row.primaryKey) {
    return row.attributes[0].columnValue.toNumber();
  }
  return null;
}

/** 
 * 新增记录
 */
async function create(client, options) {
  const views = 10;
  return await client.updateRow({
    tableName: process.env['TableName'],
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST,
      null,
    ),
    primaryKey: [{ count_name: 'views' }],
    updateOfAttributeColumns: [
      { PUT: [{ count: Long.fromNumber(views) }] },
    ],
  });
}

/**
 * 更新指定记录
 * @param {Client} client 
 * @param {*} options 
 */
async function update(client, options) {
  const views = 1;
  return await client.updateRow({
    tableName: process.env['TableName'],
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.IGNORE,
      new TableStore.SingleColumnCondition(
        'count',
        Long.fromNumber(views),
        TableStore.ComparatorType.EQUAL,
      ),
    ),
    primaryKey: [{ count_name: 'views' }],
    updateOfAttributeColumns: [
      { PUT: [{ count: Long.fromNumber(views + 1) }] },
    ],
    returnContent: { returnType: TableStore.ReturnType.Primarykey },
  });
}

app.all('/(.*)', async (ctx)=>{
  console.log(`${ctx.method} ${ctx.path} ${ctx}`)
  //common codes goes here
});
app.get('/users', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: ['hello world'],
  };
});
app.get('/users/:userId', async (ctx) => {
  const userId = ctx.params.userId;
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: [userId],
  };
});

exports.handler = app.handler;

// exports.handler = async function(event, context, callback) {
//   // 连接数据库
//   // const client = await connect(context);

//   const response = {
//     isBase64Encoded: false,
//     statusCode: 200,
//     body: JSON.stringify({
//       app: typeof app.handler,
//       event: event.toString(),
//       context,
//     }),
//   };

//   callback(null, response);
// };
