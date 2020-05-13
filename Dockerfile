FROM node:12-alpine
ADD VERSION .
RUN mkdir -p /home/node/data && chown -R node:node /home/node/data
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "./src/index.js" ]
