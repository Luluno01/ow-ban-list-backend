# Search

Search announcement by battle tag(s) (case insensitive).

For example, the query `?tags=["Back","aimBot"]` searches for ban blocks containing a battle tag that looks like `'Back'` or `'aimBot'`.

## Path

`.netlify/functions/search`

## Args

The arguments are passed via query string.

| Argument | Type       | Description             |
| -------- | ---------- | ----------------------- |
| tags     | `string[]` | Battle tags as keywords |

## Returns

An array of IDs of matched ban blocks, which has the following signature (`KeywordBanBlockQueryResult`):

```TypeScript
type BanBlockMeta = {
  id: number
  annId: number
}

type KeywordBanBlockQueryResult = BanBlockMeta[]
```

### Types

#### `BanBlockMeta`

Ban block meta information.

| Property   | Type       | Description             |
| ---------- | ---------  | ----------------------- |
| id         | `number`   | Ban block ID            |
| annId      | `number`   | Parent announcement ID  |

#### `KeywordBanBlockQueryResult`

Query result. Alias of the type `BanBlockMeta[]`.

## Throws

| Status Code | Description      |
| ----------- | ---------------- |
| 400         | Invalid argument |

No other exceptions will be thrown if the database connection is good.