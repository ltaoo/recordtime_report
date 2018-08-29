/**
 * @file 增删改查
 * @author wuya
 */
const app = require('fc-koa2-helper');
const TableStore = require('tablestore');

const { getClient, create } = require('./utils');
const Issue = require('./models/Issue');

app.all('/(.*)', async (ctx)=>{
  console.log(`${ctx.method} ${ctx.path} ${ctx}`)
  //common codes goes here
});
app.get('/issues', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: ['hello world'],
  };
});
app.post('/issues', async (ctx) => {
  const { context, body } = ctx;
  try {
    const res = await Issue.create(context, body);
    ctx.status = 200;
    ctx.body = {
      code: 'ok',
      message: 'success',
      body: res,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      code: 'error',
      message: 'fail',
      body: err,
    };
  }
});

app.get('/issues/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: [id],
  };
});
app.put('/issues/:id', async (ctx) => {
  const id = ctx.params.id;
  const body = ctx.body;
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: [id],
    body,
  };
});
app.delete('/issues/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.status = 200;
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: [id],
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
