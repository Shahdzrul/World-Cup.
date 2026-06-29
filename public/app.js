const socket=
new WebSocket(
location.origin
.replace("http","ws")
);

let pc;

async function createPeer(){

pc=
new RTCPeerConnection();

pc.onicecandidate=
(e)=>{

if(e.candidate){

socket.send(
JSON.stringify({
type:"candidate",
candidate:e.candidate
})
);

}

};

pc.ontrack=
(e)=>{

const v=
document.querySelector(
"video"
);

v.srcObject=
e.streams[0];

};

}

socket.onmessage=
async(ev)=>{

const data=
JSON.parse(ev.data);

if(data.type==="offer"){

await createPeer();

await pc.setRemoteDescription(
data.offer
);

const answer=
await pc.createAnswer();

await pc.setLocalDescription(
answer);

socket.send(
JSON.stringify({
type:"answer",
answer
})
);

}

if(data.type==="answer"){

await pc.setRemoteDescription(
data.answer
);

}

if(data.type==="candidate"){

await pc.addIceCandidate(
data.candidate
);

}

};