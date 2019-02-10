# Announcement List

This API is used to index announcements.

## Path

`.netlify/functions/announcement-list`

## Args

No arguments required for this API.

## Returns

Announcements meta information, which has the following signature (`AnnouncementList`):

```TypeScript
type AnnouncementMeta = {
  id: number
  name: string
  url: string
}

type AnnouncementList = {
  ann: AnnouncementMeta[]
  updatedAt: number
}
```

### Types

#### `AnnouncementMeta`

Announcement meta information.

| Property | Type     | Description                           |
| -------- | -------  | ------------------------------------- |
| id       | `number` | Announcement ID                       |
| name     | `string` | Name/title of the announcement        |
| url      | `string` | URL of the official announcement page |

#### `AnnouncementList`

Announcement list (not an array, though) returned by this API.

| Property  | Type                 | Description                                            |
| --------- | -------------------- | ------------------------------------------------------ |
| anns      | `AnnouncementMeta[]` | Array of announcement meta information                 |
| updatedAt | `number`             | Unix timestamp of the last update of announcement list |

## Throws

No exceptions will be thrown if the database connection is good.