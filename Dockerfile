FROM node:12-alpine
ADD VERSION .
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/data
WORKDIR /home/node/data
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "./src/index.js" ]
