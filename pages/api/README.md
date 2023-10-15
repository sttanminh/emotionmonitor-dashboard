# Get all metrics
Get all metrics

```http
GET /api/metrics
```
## URL parameters
None

## Request body
None

## Responses
### Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |

### Response body
```typescript
{
  "id": string,
  "name": string,
  "active": boolean,
  "projectId": string
}[]
```

## Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

## Response body
```javascript
{
  "message": "Internal server error"
}
```

# Get all Trello cards
Get all Trello cards

```http
GET /api/trelloCard
```
## URL parameters
None

## Request body
None

## Responses
### Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |

### Response body
```typescript
{
  "id: string,
  "taskName: string,
  "description: string,
  "projectId: string,
}[]
```

## Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

## Response body
```javascript
{
  "message": "Internal server error"
}
```
# Get all ratings
Get all ratings for a project

```http
GET /api/ratings
```
## URL parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `projectId` | `string` | Project id |
| `cardId` | `string` | Card id |
| `metricId` | `string` | Metric id |
| `startDate` | `Date` | Start date |
| `endDate` | `Date` | End date |

## Request body
None

## Responses
### Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |

### Response body
```typescript
{
  "message": string
  "id": string,
  "emoScore": int,
  "level": int,
  "levelId": string,
  "submissionId": string
  "metricId": string
}[]
```

## Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

## Response body
```javascript
{
  "message": "Internal server error"
}
```

# Get all projects
Get all projects

```http
GET /api/projects
```
## URL parameters
None

## Request body
None

## Responses
### Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |

### Response body
```javascript
{
  "id": string,
  "name": string,
  "emojis": string[],
  "referenceNumber": int,
  "trelloCards": {
    "id": string,
    "taskName": string
  }[],
  "metrics": {
    "id": string,
    "name": string,
    "active": boolean,
    "projectId": string,
    "level" : {
      "id": string,
      "levelLabel": string,
      "levelOrder": int,
      "active": boolean,
      "metricId": string
    }[]
  }
}[]
```

## Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

## Response body
```javascript
{
  "message": "Internal server error"
}
```

# Configure project
Update features of a project such as metrics, levels, emojis and reference number

```http
PUT /api/projects
```
## URL parameters
None
### Request body
```typescript
{
  "projectId": string,
  "metrics": {,
    "metricId": string,
    "metricName": string,
    "levels": {
      "levelLabel": string,
      "levelOrder": number,
    }[]
  }[]
  "emojis": string[],
  "referenceNumber": number,
}
```

### Responses
#### Status Codes

| Status Code | Description |
| :--- | :--- |
| 204 | `OK` |

### Response body
```javascript
{
  "message": "Project configured!"
}
```

### Status Codes

| Status Code | Description |
| :--- | :--- |
| 400 | `BAD REQUEST` |

### Response body
```javascript
{
  "message": "Bad request, please check request body"
}
```

### Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

### Response body
```javascript
{
  "message": "Internal server error"
}
```

# Get AI recommendations
Get AI recommendations based on the ratings of a card over a period of time

```http
POST /api/recommendations
```
## URL parameters
None
### Request body
```typescript
{
  "taskName": string,
  "ratings": {
    "emoScore": number,
    "level": number,
    "metric": {
      "name": string,
      "levels": {
        "levelLabel": string,
        "levelOrder": string
      }[]
    }
  }[]
}
```

### Responses
#### Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |

### Response body
If there were no ratings send via request body (array was empty)
{
```javascript
{
  "message": "No ratings for this card"
}

Otherwise
{
```javascript
{
  "message": "<Recommendations from AI>"
}
```

### Status Codes

| Status Code | Description |
| :--- | :--- |
| 400 | `BAD REQUEST` |

### Response body
```javascript
{
  "message": "Bad request, please check request body"
}
```

### Status Codes

| Status Code | Description |
| :--- | :--- |
| 500 | `INTERNAL SERVER ERROR` |

### Response body
```javascript
{
  "message": "Internal server error"
}
```
