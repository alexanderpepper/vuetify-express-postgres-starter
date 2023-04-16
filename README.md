# vuetify-express-postgresql-starter

## Code style
This project uses [JavaScript Standard Style](https://github.com/standard/standard), enforced (so far only in the front end) by [ESLint](https://eslint.org/).

Use of ES6+ features in this project is encouraged.

## Tech/framework used

- [PostgreSQL](https://www.postgresql.org/)
- [express](https://express.io/)
- [PM2](http://pm2.keymetrics.io/)
- [webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [SuperAgent](https://visionmedia.github.io/superagent/)
- [VueJS](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)

## Prequisites
* PostgreSQL
* NodeJS
* PM2 (for production deployment)

## Installation

Clone the repository
```shell script
git clone https://github.com/alexanderpepper/vuetify-express-postgresql-starter.git
```

Install NPM packages
```shell script
cd evc
npm install
cd client
npm install
```

Install PM2 for production deployment
```shell script
npm install -g pm2
```

## Configuration

### Add AWS Credentials

* Update `server/aws-credentials.json` with the following content:

```json
{
  "accessKeyId": "<access key ID or empty string>",
  "secretAccessKey": "<secret access key or empty string>",
  "supportEmail": "support@vuetify-express-postgresql-starter.com",
  "noReplyEmail": "no-reply@vuetify-express-postgresql-starter.com"
}
```

### Add Twilio credentials

* Create a file `server/twilio-credentials.json` with the following contents:
```json
{
  "accountSid": "<account SID or empty string>",
  "authToken": "<auth token or empty string>"
}
```

## Development
Running the server and client as separate processes gives the best development experience with hot reloading in the client app.

The client app is
* Configured in `client/.env.development` to use `http://localhost:3000/api` as the base API path when running in development
* Configured in `client/.env.production` to use `/api` as the base API path when built for production

## Running the Server in Development
To run the express server in devepment mode on `https://localhost:3000`:
```bash
node .
```
express uses swagger to document the server's REST API. This can be viewed at `http://localhost:3000/explorer`

## Running the Client in Development
To run the Vue client in development mode on `http://localhost:8080`
```bash
cd client
npm run serve
```

## Preparing for Deployment
Acquire a standalone certificate from [LetsEncrypt](https://letsencrypt.org/) and create `server/ssl-config.js` with the following content:

```javascript
const path = require('path')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'

exports.privateKey = isProd ? fs.readFileSync(path.join('/path/to/privkey.pem')).toString() : ''
exports.certificate = isProd ? fs.readFileSync(path.join('/path/to/cert.pem')).toString() : ''
exports.chain = isProd ? fs.readFileSync(path.join('/path/to/chain.pem')).toString() : ''
exports.fullchain = isProd ? fs.readFileSync(path.join('/path/to/fullchain.pem')).toString() : ''
```

## Deploying for Production

When the server starts, `/server/boot/client.js` builds the client app by running `npm run build`  in the `client` folder.


To start the server
```bash
node_modules/pm2/bin/pm2 start pm2.json --env production
```

To stop the server
```bash
node_modules/pm2/bin/pm2 kill
```

To monitor the server
```bash
node_modules/pm2/bin/pm2 monit
```

## Docker

build the images with `docker-compose build —no-cache`

`docker-compose up -d` for backend / postgres

## License
MIT © 2018 [Alex Pepper](https://alexpepper.us)
