# Parcel Lab Challenge

## Pipeline status:

[![api](https://github.com/dogabudak/parcellab/actions/workflows/workflow.yaml/badge.svg)](https://github.com/dogabudak/parcellab/actions/workflows/workflow.yaml)

## Prerequisites

Please make sure that you have `docker` and `yarn` installed. You can simply check with running these
commands `docker --version` `yarn --version`

### Package Manager

This application is using Dockerized Backend with Dockerized mongodb. To start the application with mongodb please
simply run the command `docker-compose up -d`. This will create 2 containers, one for the application and the other for
mongodb respectively.

## Work place structure

This application follows a monorepo approach. The following sections explains the folder structure:

-   `./db/`: Contains everything related to database, queries, seeders, models, csv's etc.
-   `./src/cron`: Contains things related to cron job which periodically refreshes the db.
-   `./tests/unit`: Unit tests for the project.
-   `./tests/integration`: Integration test for the project
-   `./swagger.json`: Swagger object for documenting the application
-   `./.github/`: PR templates and Github Action definitions.
-   `.gitignore`: File and folder globs to be ignored by git.
-   `package.json`: The node package definition, with packages links and scripts.
-   `yarn.lock`: Auto generated lock file from yarn.
-   `./tests/jest.*.js`: Global jest config for testing.
-   `.prettier`: Config containing prettier files.
-   `.tsconfig.*`: Global typescript configuration.

### Application Architecture:

![img.png](img.png)

### Design decisions and explanations to the reviewer:

#### Language Selection

The application is written in typescript. The only reason I choose this is because of its type assistance and
similarities with node.js. Since node.js was recommended, I wanted to use something like node.js yet i wanted to make
use of the types. But reviewer can simply think that I was not enough type safe because the application has multiple
implicit `any`. But for the sake of the challenge I only typed the things I need and which is often used.

#### Weather app

In this application i used another weather application than suggested. I took this decision only because this app was
easier to use and data was easier to fetch. All the data which are provided is for free in the meanwhile suggested app
required a paid subscription to get historical and statistical data.

#### Refresh Mechanism

There were many approaches that i considered while i was writing this code. But for the sake of this challenge I went
for the easy approach. A Cron job Runs every 5 minutes, checks the results which did not updated lately. If its a date
in the future, it re-fetches the forecast. If it's in the past it skips.

#### Testing

I used a simple Behaviour driven test approach . I wrote the tests depending on the reviewers behaviour first and then i
implemented the code inside. Due to the time limitation, I could not add extra flavors to the tests but rather keep the
covarage as high as possible.

### Future Improvements:

Here in this application I did not take care of timezone, caller can be simply from a different time zone or requested
location can be. But for the sake of the challenge i simply assumed that there is only one timezone.
