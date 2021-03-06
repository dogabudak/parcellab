FROM node:14.17.6 AS builder

WORKDIR /usr/src/app
COPY package.json .
# Install all Packages
RUN yarn install
# Copy all other source code to work directory
ADD . /usr/src/app
# Start
CMD [ "yarn", "start" ]
EXPOSE 7001
