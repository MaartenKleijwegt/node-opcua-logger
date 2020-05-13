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

        const session = await client.createSession(conf.user, conf.pass);

        const crawler = new opcua.NodeCrawler(session);

        const data = await crawler.read("ns=0;i=80");
        console.log(data);

        await session.close();
        await client.disconnect();
      }
    } catch (err) {
        console.log("err = ", err.message);
    }
};

module.exports = { crawl }
