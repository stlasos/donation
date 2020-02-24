# Donation

## Install

Firstly, run these commands.

``` bash
# install dependencies
npm install

# build
npm run dev
```

After that you should fill the `dbconf.json` file with your mongodb connection settings.

You can copy the [config example](dbconf.example.json).

### Database Configuration

Name | Description | Default value
-----|-------------|--------------
name | Database name (if not exists it will be created) | test
host | Database host | localhost
port | Database port | 27017
user | Username for database (optional) | 
password | User's password (optional)

Then run

``` bash
# create database and collection
node create_db.js
# Database created!
# Collection created!

# run server (if you want to change an application port, check server/index.js)
node server/index.js
# Server Started - http://localhost:3000
```

And visit http://localhost:3000