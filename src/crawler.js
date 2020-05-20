let opcua = require('node-opcua')
const path = require('path');
fs = require('fs');
var treeify = require('treeify');

const config = require('./config.js');

let conf = config.load();

//Date building
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

async function crawl () {

    try {
        const client = opcua.OPCUAClient.create({
            endpoint_must_exist: false,
    //        securityMode: opcua.MessageSecurityMode.SIGNANDENCRYPT,
    //        securityPolicy: opcua.SecurityPolicy.Basic128Rsa15,
        });


      const endpoint = conf.opcua.url;
      await client.connect(endpoint);
    //  const endpoints = await client.getEndpoints();
    //  console.log(endpoints);
        var userIdentity = {
          userName: conf.opcua.user,
          password: conf.opcua.pass,
        }

        let session =  await client.createSession();

        let crawler = new opcua.NodeCrawler(session);
      //  crawler.on("browsed",function(element){
        //  console.log("->",element.browseName.name,element.nodeId.toString());
        //});


        var fileName = './data/crawledDataPoints' + year + month + date + hours + minutes + seconds + '.json';
        var nodeId = "ns=4;i=2"
        var nodeId = "ObjectsFolder"
      //  data = await crawler.read(nodeId);
      //  treeify.asLines(data, true, true, function (line) {
      //      console.log(line);
      //      fs.writeFile(fileName, data, function (err) {
      //        if (err) return console.log(err);
      //      });
      //      });
            console.log('File writing with crawled points succesfull!');
        await session.close();
        await client.disconnect();

    } catch (err) {
        console.log("err = ", err);
    }
};

module.exports = { crawl }
