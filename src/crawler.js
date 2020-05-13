let opcua = require('node-opcua')
const path = require('path');

const config = require('./config.js');

let conf = config.load();

async function crawl () {
    try {
        const client = opcua.OPCUAClient.create({
            endpoint_must_exist: false
        });

        const endpoint = conf.opcua.url;
        await client.connect(endpoint);
        var userIdentity = {
          userName: conf.opcua.user,
          password: conf.opcua.pass,
        }

        let session = await client.createSession(userIdentity);

        let crawler = new opcua.NodeCrawler(session);

        const data = await crawler.read();
        console.log(data);

        await session.close();
        await client.disconnect();

    } catch (err) {
        console.log("err = ", err);
    }
};

module.exports = { crawl }
