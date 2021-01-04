
# Scheduler
A repository for a scheduler application that allows users to find the classes for the rest of their school year based off of their major, courses taken, and more. Available for iOS, android and Web Apps.

```
WebFrontEnd: React or Angular
MobileFrontEnd: Native Environment?
Backend: Nodejs (AWS serverless)
Database: Postgresql
```


## Installation
### Backend

Use the package manager [npm](https://nodejs.org/en/download/) to install required node modules for schedulerServer.

```bash
npm install
```

#### Usage
create config.js file under schedulerServer/config/

```js
module.exports =  {
    DATABASE: 'Database Name',
    HOST: 'Host URL',
    PORT: '5432',
    USER: 'User Name',
    PASSWORD: 'Password',
    SECRET_KEY_HASH: "UUID",
    BCRYPT_SALT_ROUNDS: 12,
    JWT_TOKEN: "UUID"
  }
```

start up serverless environment from schedulerServer directory

```bash
serverless offline
```

### Frontend

Use the package manager [npm](https://nodejs.org/en/download/) to install required node modules for schedulerWeb.

```bash
npm install
npm install -g yarn
```

#### Usage
start up react environment from schedulerWeb directory

```bash
yarn dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
