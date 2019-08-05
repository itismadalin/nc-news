# NC NEWS - Northcoders News

## Getting Started

NC NEWS is an RESTful news API back-end project API which was built with Node.js and Express.js.

Our database is PSQL, and we used [Knex](https://knexjs.org) to interact with it.

# Setting up your own repository

Clone this repo:

```bash
git clone https://github.com/madalinmonaco/nc-news

cd be-nc-news
```

On GitHub create your own **public** repository for your project. **Make sure NOT to initialise it with a README or .gitignore.**

Next, you should hook your local version up to the newly created GitHub repo. Use the following terminal commands, making sure to check the git remotes with each step (`git remote -v`):

```bash
git remote remove origin

# This will prevent you from pushing to the original Northcoders' repo.
```

```bash
git remote add origin <YOUR-GITHUB-URL>

# This will add your GitHub location to your local git repository.
# You can confirm this by checking the new git remote.
```

# Prerequisites

To initialise your repo, you will have to:

# npm init -y

# npm i

# npm i < package name >
Tag a -d to the end of the install to identify which packages are mandatory for deployment. These will be listed under the 'dependencies'.

# npm i < package name > -d
"dependencies": {
    "chai-sorted": "^0.2.0",
    "express": "^4.17.1",
    "knex": "^0.19.0",
    "lodash": "^4.17.14",
    "nodemon": "^1.19.1",
    "pg": "^7.11.0"
  }

# npm i <package name> -D
"devDependencies": {
    "chai": "^4.2.0",
    "mocha": "^6.1.4",
    "supertest": "^4.0.2"
  }

#Create your knexfile

Before you move on, you will need to create a knexfile.js in the root folder (if you are on Linux please make sure your username and password will match your psql login details; this is not necessary on a Mac computer).

## Migrations

You will need to create your migrations and complete the provided seed function to insert the appropriate data into your database.

This is where you will set up the schema for each table in your database.

# Running the tests

`npm test` will go through every endpoints' test with help from a dummy request which is sent to the server in order to get the   expected response as a result.

# Deployment

### Install Heroku App

Make sure your application and your database is hosted using Heroku App.