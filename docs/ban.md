# Ban

Populate ban blocks. There are two usages of this API.

1. Query the ban blocks of a specific announcement.
2. Retrieve a ban block with specific ID.

For example, the query `?ann=1&index=0` retrieves the first (`index + 1`-th) ban block of the announcement, where the ID of the announcement equals to 1 (`ann`); the query `?id=1` retrieves the ban block with the ID 1 (`id`).

## Path

`.netlify/functions/ban`

## Args

This API accepts two types of argument sets corresponding to different usages respectively.

The arguments are passed via query string.

For the first usage:

| Argument | Type     | Description            |
| -------- | -------- | ---------------------- |
| ann      | `number` | Announcement ID        |
| index    | `number` | Index of the ban block |

For the second usage:

| Argument | Type     | Description  |
| -------- | -------- | ------------ |
| id       | `number` | Ban block ID |

## Returns

For the first usage, this API returns the desired ban block and the total number of ban blocks the announcement owns wrapped as an object, which has the following signature (`IndexedBanBlockQueryResult`):

```TypeScript
type BanBlock = {
  id: number
  header: string
  battleTags: string[]
  annId: number
}

type IndexedBanBlockQueryResult = {
  ban: BanBlock
  count: number
}
```

For the second usage, this API returns the desired ban block, which if of type `BanBlock`.

### Types

#### `BanBlock`

Ban block.

| Property   | Type       | Description             |
| ---------- | ---------  | ----------------------- |
| id         | `number`   | Ban block ID            |
| header     | `string`   | Header of the ban block |
| battleTags | `string[]` | Banned battle tags      |
| annId      | `number`   | Parent announcement ID  |

#### `IndexedBanBlockQueryResult`

Query result (the first usage).

| Property   | Type              | Description                                                     |
| ---------- | ----------------  | --------------------------------------------------------------- |
| ban        | `BanBlock | null` | Ban block (could be null if the announcement has no ban blocks) |
| count      | `number`          | The total number of ban blocks the announcement owns            |

## Throws

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 400         | Invalid argument                 |
| 404         | Specified ban block ID not found |

No other exceptions will be thrown if the database connection is good.