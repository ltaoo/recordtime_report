const TableStore = require('tablestore')
const debug = require('debug')('ots');

module.exports = {
  getRow,
  putRow,
  updateRow,
  deleteRow,
  getRange,
  batchWriteRow,

  getPKMap,
  getPKMapList,
  getAttrMap,
  batchGetRow
}

function batchGetRow(akInfo, params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.batchGetRow(params, function(err, data){
      debug('batchGetRow:', params, err,  JSON.stringify(data));
      if(err){
        console.log('batchGetRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function batchWriteRow(akInfo, params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.batchWriteRow(params, function(err, data){
      debug('batchWriteRow:', params, err,  JSON.stringify(data));
      if(err){
        console.log('batchWriteRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function getRow(akInfo,params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.getRow(params, function(err, data){
      debug('getRow:',params, err,  JSON.stringify(data));
      if(err){
        console.log('getRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function putRow(akInfo,params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.putRow(params, function(err, data){
      debug('putRow:', params, err,  JSON.stringify(data));
      if(err){
        console.log('putRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function updateRow(akInfo,params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.updateRow(params, function(err, data){
      debug('updateRow:', params, err, JSON.stringify(data));
      if(err){
        console.log('updateRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function deleteRow(akInfo,params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.deleteRow(params, function(err, data){
      debug('deleteRow:', params, err, JSON.stringify(data));
      if(err){
        console.log('deleteRow:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}
function getRange(akInfo,params){
  var client = getClient(akInfo);
  return new Promise((a,b)=> {
    client.getRange(params, function(err, data){
      debug('getRange:', params, err, JSON.stringify(data));
      if(err){
        console.log('getRange:'+JSON.stringify(params)+'-----err:'+JSON.stringify(err))
        b(err);
      }
      else a(data);
    });
  });
}

//----------------
function getPKMap(arr) {
  if (!arr) return {};
  var m = {};
  arr.forEach(n => {
    m[n.name] = n.value;
  });
  return m;
}
function getPKMapList(arr) {
  if (!arr) return [];
  var t=[];
  arr.forEach(n => {
    var m = {};
    m[n.name] = n.value;
    t.push(m)
  });
  return t;
}
function getAttrMap(arr) {
  if (!arr) return {};
  var m = {};
  arr.forEach(n => {
    m[n.columnName] = n.columnValue;
  });
  return m;
}
//----------------------

function getClient(akInfo){
  var client = new TableStore.Client({
    accessKeyId: akInfo.accessKeyId,
    secretAccessKey: akInfo.accessKeySecret,
    securityToken: akInfo.securityToken,
    endpoint: akInfo.endpoint,
    instancename: akInfo.instancename,
  });
  return client;
}
