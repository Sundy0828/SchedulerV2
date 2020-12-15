# SchedulerV2
A repository for a scheduler application that allows users to find the classes for the rest of their school year based off of their major, courses taken, and more. Available for iOS, android and Web Apps.\
Front end: angular\
Backend: nodejs (AWS serverless)\
Database: postgresql


## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install required node modules for schedulerServer.

```bash
npm install
```

## Usage
create config.js file under schedulerServer/config/

```nodejs
module.exports =  {
    DATABASE: 'Database Name',
    HOST: 'Host URL',
    PORT: '5432',
    USER: 'User Name',
    PASSWORD: 'Password',
    SECRET_KEY_HASH: "UUID",
    BCRYPT_SALT_ROUNDS: 12
  }
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
