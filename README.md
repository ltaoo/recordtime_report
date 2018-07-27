# 时间报表

配合 [record time](https://github.com/ltaoo/recordTime) 番茄钟软件使用的页面，填写会返回特定格式要求的 API 地址，就能够统计指定天的时间。

格式如下，这是阿里云函数表格存储读取记录默认返回的格式。

```json
{
    "consumed":
    {
        "capacity_unit":
        {
            "read": 1,
            "write": 0
        }
    },
    "rows": [
    {
        "primaryKey": [
        {
            "name": "id",
            "value": "1532656296219"
        }],
        "attributes": [
        {
            "columnName": "content",
            "columnValue": "写周报 + 杂事",
            "timestamp": 1532656296267
        },
        {
            "columnName": "endtime",
            "columnValue": "1532656246579",
            "timestamp": 1532656296267
        },
        {
            "columnName": "starttime",
            "columnValue": "1532654746554",
            "timestamp": 1532656296267
        }]
    },
    {
        "primaryKey": [
        {
            "name": "id",
            "value": "1532658057988"
        }],
        "attributes": [
        {
            "columnName": "content",
            "columnValue": "写周报 + 站会",
            "timestamp": 1532658058042
        },
        {
            "columnName": "endtime",
            "columnValue": "1532658046614",
            "timestamp": 1532658058042
        },
        {
            "columnName": "starttime",
            "columnValue": "1532656546605",
            "timestamp": 1532658058042
        }]
    },
    {
        "primaryKey": [
        {
            "name": "id",
            "value": "1532659855782"
        }],
        "attributes": [
        {
            "columnName": "content",
            "columnValue": "写周报",
            "timestamp": 1532659855840
        },
        {
            "columnName": "endtime",
            "columnValue": "1532659846656",
            "timestamp": 1532659855840
        },
        {
            "columnName": "starttime",
            "columnValue": "1532658346626",
            "timestamp": 1532659855840
        }]
    },
    {
        "primaryKey": [
        {
            "name": "id",
            "value": "1532695212513"
        }],
        "attributes": [
        {
            "columnName": "content",
            "columnValue": "图表展示时间",
            "timestamp": 1532695212548
        },
        {
            "columnName": "endtime",
            "columnValue": "1532695208912",
            "timestamp": 1532695212548
        },
        {
            "columnName": "starttime",
            "columnValue": "1532693708897",
            "timestamp": 1532695212548
        }]
    }],
    "next_start_primary_key": null,
    "next_token": null,
    "RequestId": "000571fb-4aaa-4af7-c200-d90b5b313429"
}
```

## todo

- API 返回数据格式修改为更友好的方式

## screenshot

![示例](./screenshots01.png)