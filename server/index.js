const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
const stuff = require ("../client.js");
let lastClientId = 0;
let clients = [];


app.get("/test",function (req,res) {
  res.json(stuff);
});

app.post("/client",function (req,res) {
  lastClientId ++;
  let client = {name:req.body.name, clientId:lastClientId,lat:"",long:"",location:""};
  clients.push(client);
  res.json(client);
  console.log(client);
});

app.post("/locations", (req, res) =>{
  //{id:3, lat:"sldfk", long:"laskd"}
  let lat = req.body.lat;
  let long = req.body.long;
  let id = req.body.id;
  let client = clients.find(c=>c.clientId == id)

  fetch('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + long +'&zoom=18&addressdetails=1', 
  { 
    method: 'GET', 
    headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  }
})
  .then(res => res.json())
  .then(json => {
    client.location = json.address;
    res.json(json);
    // console.log(json)
  });
});


//find clientid + update with the long & lat that you found


const port = process.env.PORT || 3009;
app.listen(port, () => {
console.log(`Listening on port:${port}`);
});