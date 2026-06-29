const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const wss = new WebSocket.Server({
server
});

let broadcaster=null;
let viewers=[];

wss.on("connection",(ws)=>{

ws.on("message",(msg)=>{

const data=
JSON.parse(msg);

if(data.type==="broadcaster"){
broadcaster=ws;
}

if(data.type==="viewer"){
viewers.push(ws);

if(
broadcaster &&
broadcaster.readyState===1
){
broadcaster.send(
JSON.stringify({
type:"viewer"
})
);
}
}

if(
data.type==="offer" ||
data.type==="answer" ||
data.type==="candidate"
){

wss.clients.forEach(c=>{

if(
c!==ws &&
c.readyState===1
){
c.send(msg);
}

});

}

});

});

server.listen(
3000,
()=>console.log(
"running"
)
);