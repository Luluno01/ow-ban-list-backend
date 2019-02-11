# ow-ban-list-backend

Get the ban list from Overwatch BBS (China). Currently deployed at [ow-ban-list-v1.0x00000000.tk](https://ow-ban-list-v1.0x00000000.tk).

## Requirements

* `Node.js` runtime environment (`8.x` or above)
* `npm` or other functionally equivalent package manager (used to install dependencies and build)
* `PostgreSQL` (used to store the ban list)
* A [Netlify](https://www.netlify.com) account

## APIs

* [`announcement-list`](https://github.com/Luluno01/ow-ban-list-backend/blob/master/docs/annoucement-list.md)
* [`ban`](https://github.com/Luluno01/ow-ban-list-backend/blob/master/docs/ban.md)
* [`last-update`](https://github.com/Luluno01/ow-ban-list-backend/blob/master/docs/last-update.md)
* [`search`](https://github.com/Luluno01/ow-ban-list-backend/blob/master/docs/search.md)

## Development and Deploy

### Clone

To continue develop and/or deploy this project, first you need to clone this repository to you local workspace.

```bash
git clone https://github.com/Luluno01/ow-ban-list-backend.git --depth=1 --recursive
```

Then you will need to install dependencies using `npm` **inside** the cloned repository directory.

```bash
npm install
```

### Deploy a PostgreSQL Database

There are many ways to deploy a PostgreSQL database. You can

* install a PostgreSQL database instance on your cloud server or your local PC, or
* deploy a PostgreSQL container on the cloud, or
* deploy a PostgreSQL database instance on [ElephantSQL](https://www.elephantsql.com/),
which provides 20 MB data capacity and 5 concurrent connections for free (personally recommended for development usage)

After deploy your PostgreSQL database, you shall have a database connection URL, which looks like

> postgres://username:password@database.host.com:5432/database_name

If your database service provider doesn't provide you a connection URL, you can simply construct one.

Then you need to set a environment variable `DB_URL` to the connection URL in your workspace.

```bash
set DB_URL=<your connection URL>
```

### Build

For quicker build and debug, you can set the environment variable `DEBUG` to an arbitrary value in your workspace to enable development mode.

```bash
set DEBUG=true
```

If it is the first time you build the cloned repository, you should run

```bash
npm run build
```

Otherwise

```bash
npm run buildFunction
```

### Synchronize Database

Note that you need a `DB_URL` environment set to a PostgreSQL connection URL for this step.

By executing the following command, you will fetch all the ban announcements from Overwatch BBS (China) into your database (old tables will be **dropped** and re-created).

```bash
npm run sync
```

If no changes are made to the database schemas, you will not need to execute this command a second time.
However, everytime you move to a new database instance or change the database schema, you should synchronize the database again.

### Running Locally

Note:

1. This step is not require if you only want to deploy this repository.
2. You need a `DB_URL` environment set to a PostgreSQL connection URL for this step.

Simply run

```bash
npm run serve
```

Then you can access the APIs via `http://localhost:9000/`. Of course you need to build and synchronize database at least once before running the server locally.

### Deploy to Netlify

To deploy this repository, click the button below.

[<img src="https://camo.githubusercontent.com/be2eb66bb727e25655f1dcff88c2fdca82a77513/68747470733a2f2f7777772e6e65746c6966792e636f6d2f696d672f6465706c6f792f627574746f6e2e737667" alt="Deploy to Netlify" data-canonical-src="https://www.netlify.com/img/deploy/button.svg" style="max-width:100%;">](https://app.netlify.com/start/deploy?repository=https://github.com/Luluno01/ow-ban-list-backend)

**IMPORTANT NOTE:** Please remember to set the `DB_URL` environment variable in the site settings pannel.

Or you can deploy your own repository, see [Netlify documentation](https://www.netlify.com/docs/) for more details.