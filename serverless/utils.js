const TableStore = require('tablestore');
const Long = TableStore.Long;

module.exports = {
  getClient,

  fetch,
  create,
  update,
};
function createColumns(params) {
  return Object.keys(params).map(key => {
    return { [key]: params[key] };
  });
}
/**
 * 连接数据库
 * @param {*} context 
 * @return {Client} - 数据库实例
 */
function getClient(context) {
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
async function create(client, body) {
  const { pks, attrs } = body;
  console.log(pks, createColumns(pks), attrs, createColumns(attrs));
  return client.updateRow({
    tableName: process.env['TableName'],
    condition: new TableStore.Condition(
      TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST,
      null,
    ),
    // { 主键名: 主键值 }
    primaryKey: createColumns(pks),
    updateOfAttributeColumns: [
      { 
        PUT: createColumns(attrs)
      },
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
