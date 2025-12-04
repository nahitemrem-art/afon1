# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Funds

#### Get All Funds
```
GET /funds
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `category` (string): Filter by category
- `sortBy` (string): Sort field (name, daily_return, monthly_return, yearly_return)
- `sortOrder` (string): Sort order (asc, desc)
- `search` (string): Search by name or code

Response:
```json
{
  "data": [
    {
      "id": "string",
      "code": "string",
      "name": "string",
      "price": 0,
      "date": "string",
      "dailyReturn": 0,
      "weeklyReturn": 0,
      "monthlyReturn": 0,
      "threeMonthReturn": 0,
      "sixMonthReturn": 0,
      "yearlyReturn": 0,
      "category": "string",
      "totalValue": 0
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 50,
  "totalPages": 0
}
```

#### Get Fund by Code
```
GET /funds/:code
```

#### Get Fund Price History
```
GET /funds/:code/history?days=30
```

#### Get Categories
```
GET /funds/categories/list
```

### Portfolio

#### Get All Portfolios
```
GET /portfolio
```

#### Create Portfolio
```
POST /portfolio
```

Body:
```json
{
  "name": "string"
}
```

#### Get Portfolio by ID
```
GET /portfolio/:id
```

#### Add Fund to Portfolio
```
POST /portfolio/:id/funds
```

Body:
```json
{
  "fundCode": "string",
  "quantity": 0,
  "price": 0
}
```

#### Remove Fund from Portfolio
```
DELETE /portfolio/:id/funds/:fundCode
```

#### Delete Portfolio
```
DELETE /portfolio/:id
```

### Favorites

#### Get All Favorites
```
GET /favorites
```

#### Add to Favorites
```
POST /favorites
```

Body:
```json
{
  "fundCode": "string"
}
```

#### Remove from Favorites
```
DELETE /favorites/:fundCode
```

#### Check if Favorite
```
GET /favorites/check/:fundCode
```

### Live Returns

#### Get All Live Returns
```
GET /live?fundCodes=AAA,BBB
```

#### Get Live Return by Code
```
GET /live/:fundCode
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
