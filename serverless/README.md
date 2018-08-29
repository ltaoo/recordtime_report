# 参考资料

## Node

### Node 入口函数

`event`的具体值

```json
{
    "body": "",
    "headers":
    {
        "Upgrade-Insecure-Requests": "1",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "X-Ca-Api-Gateway": "619CCFCB-404F-4C89-B590-7A814A7C4A31",
        "Accept-Encoding": "gzip, deflate",
        "X-Real-IP": "115.236.92.74",
        "X-Forwarded-Proto": "http",
        "X-Forwarded-For": "115.236.92.74",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "CA-Host": "6f6543b4ff354955a3d2ba0475c49999-cn-hangzhou.alicloudapi.com"
    },
    "httpMethod": "GET",
    "isBase64Encoded": true,
    "path": "/",
    "pathParameters": {},
    "queryParameters": {}
}
```

`context`

```json
{
    "app":
    {},
    "context":
    {
        "requestId": "2F41D0DC-D4D2-4A24-B10D-A608B16C2E38",
        "credentials":
        {
            "accessKeyId": "STS.NKKJ4fxwXFRPSA1RpHM7UN1eB",
            "accessKeySecret": "FUQXx4EgWunH24BgpoSPY2HpbkmuRoHs6dkSg1HoTkUx",
            "securityToken": "CAISnAJ1q6Ft5B2yfSjIr4j+AY7Slah58ZC7UWeAtnAdQbh5ofTOoDz2IHxPf3JuAO0Xv/wwnWlQ7/0alqZdVplOWU3Da+B364xK7Q75ujYVZHzxv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmkpDFsUaF1QCnlL5K99WgGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vcYomyc4IjAUggJvEzfa7OPqscpJQt4d7U8FaVLof7xj/Rkt+DJkID6jh1LeOFcVSvNRIe9hcrfA/6kKswwfrX2IWRzX1EIugQU2BqAAR7UyzOTKjtFTIPxF5xfi30wWfNt6OAELAJToPb6nvSTumPLdGWUZM0t7doIa94N0NJiKw4SP3uSyT12g/VCbWS16qyAdAirznvDyAdzjaiGEkY3e3GRtYVZ48tKNm0AvU21ZbG5gEIVo/Hy5r/Xqe6bo4UsujVYBMxrog6OahAb"
        },
        "function":
        {
            "name": "apis",
            "handler": "index.handler",
            "memory": 128,
            "timeout": 60
        },
        "service":
        {
            "name": "issueTracker",
            "logProject": "",
            "logStore": ""
        },
        "region": "cn-hangzhou",
        "accountId": "1851343155697899"
    }
}
```

https://help.aliyun.com/document_detail/62213.html?spm=a2c4g.11186623.4.4.38a6793bEkofeT#nodejs

### Node 环境

https://help.aliyun.com/document_detail/58011.html?spm=a2c4g.11186623.2.7.518b1471A83Oks

## 错误类型

https://help.aliyun.com/document_detail/52736.html?spm=a2c4g.11186623.2.22.49165ed6BCJDR4