# DRAFT: API v1 specification

The root for the API is `/api/v1`. All the endpoints starts from there.

## Headers
```
X-FBTREX-USERID: <currentUserID>
```

### Post Events
*Endpoint*: `POST /events`


#### Payload for a Timeline
```
{
    "type": "timeline",
    "id": "<UUID>",
    "startTime": "<ISO8601 DateTime>"
}
```

Note: server side the `id` is `sha1(currentUserId + timelineId)`.

#### Payload for a Public Post
```
{
    "type": "post",
    "visibility": "public",
    "impressionTime": "<ISO8601 DateTime>",
    "impressionOrder": "<int>",
    "timelineId": "<UUID>",
    "html": "<html snippet>"
}
```

Note, server side:
 - the `id` is `sha1(currentUserId + timelineId + impressionOrder)`.
 - `htmlId` is `sha1(html snippet)`

#### Payload for a Private Post
```
{
    "type": "post",
    "visibility": "private",
    "impressionTime": "<ISO8601 DateTime>",
    "impressionOrder": "<int>",
    "timelineId": "<UUID>"
}
```

Note, server side:
 - the `id` is `sha1(currentUserId + timelineId + impressionOrder)`.