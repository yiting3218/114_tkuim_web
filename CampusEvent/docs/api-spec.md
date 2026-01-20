# API 規格說明文件

## API Base URL
http://localhost:3000/api

## 資料格式說明
Participant（報名資料）物件格式
{
  "_id": "ObjectId",
  "name": "姓名",
  "studentId": "學號",
  "department": "系級",
  "eventTitle": "活動名稱",
  "status": "pending | confirmed",
  "note": "",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}

## 新增報名資料（Create）
API 路由: POST /api/participants
說明: 新增一筆活動報名資料，姓名、學號、系級、活動名稱為必填欄位。
Request Body（JSON）
{
  "name": "王小明",
  "studentId": "410123456",
  "department": "資管三A",
  "eventTitle": "羽球比賽"
}
1. 成功回應（201 Created）
{
  "success": true,
  "message": "Participant created",
  "data": {
    "id": "696fc7bb7a72b9c1dc2f658e"
  }
}
2. 失敗回應（400 Bad Request）
{
  "success": false,
  "message": "name, studentId, department, eventTitle are required"
}

## 取得所有報名資料
API 路由: GET /api/participants
說明: 取得目前系統中所有報名資料，依建立時間由新到舊排序。
1. 成功回應（200 OK）
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "_id": "696fc7bb7a72b9c1dc2f658e",
      "name": "王小明",
      "studentId": "410123456",
      "department": "資管三A",
      "eventTitle": "羽球比賽",
      "status": "pending",
      "note": "",
      "createdAt": "2026-01-20T18:21:47.305Z",
      "updatedAt": "2026-01-20T18:21:47.305Z"
    }
  ]
}

## 取得單筆報名資料
API 路由: GET /api/participants/:id
說明: 依據報名資料 ID 取得單筆報名內容。
URL範例: GET /api/participants/696fc7bb7a72b9c1dc2f658e
1. 成功回應（200 OK）
{
  "success": true,
  "message": "OK",
  "data": {
    "_id": "696fc7bb7a72b9c1dc2f658e",
    "name": "王小明",
    "studentId": "410123456",
    "department": "資管三A",
    "eventTitle": "羽球比賽",
    "status": "pending",
    "note": "",
    "createdAt": "2026-01-20T18:21:47.305Z",
    "updatedAt": "2026-01-20T18:21:47.305Z"
  }
}

2. 失敗回應（404 Not Found）
{
  "success": false,
  "message": "Participant not found"
}

## 更新報名資料
API 路由: PUT /api/participants/:id
說明: 更新指定報名資料內容，常用於確認報名狀態或修改活動名稱。
Request Body（JSON）
{
  "status": "confirmed",
  "eventTitle": "系際羽球賽"
}

1. 成功回應（200 OK）
{
  "success": true,
  "message": "Participant updated",
  "data": null
}

2. 失敗回應（404 Not Found）
{
  "success": false,
  "message": "Participant not found"
}

## 刪除報名資料（Delete）
API 路由: DELETE /api/participants/:id
說明: 刪除指定 ID 的報名資料。
URL 範例: DELETE /api/participants/696fc7bb7a72b9c1dc2f658e
1. 成功回應（200 OK）
{
  "success": true,
  "message": "Participant deleted",
  "data": null
}

2. 失敗回應（404 Not Found）
{
  "success": false,
  "message": "Participant not found"
}
