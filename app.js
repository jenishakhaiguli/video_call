const express = require('express');
const http = require('http');

//for 3000 or heroku
const PORT = process.env.PORT || 3000;

const app = express();


//creating server and passing application
const server = http.createServer(app);
const io = require('socket.io')(server);




//middleware
app.use(express.static('public'));




  
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let connectedPeers = [];


// //is called directly after the connection has been opened
io.on('connect', (socket) => {
    console.log('client connected to server');
    connectedPeers.push(socket.id);
    //for more than one connected user
    //if client connects to the server then the id will be printed
    console.log(connectedPeers);


    socket.on('pre-offer', (data) => {
        console.log('pre-offer-came-on-server-from-caller');
        // console.log(data);

        const { calleePersonalCode, callType } = data;

        //connectedPeer is the one who is being called
        const connectedPeer = connectedPeers.find((peerSocketId) => {
            return (peerSocketId === calleePersonalCode);   
        });

        console.log(`calling: ${connectedPeer}`);
        if (connectedPeers){
            const data ={
                callerSocketId: socket.id,
                callType,
            };
            console.log('caller connected to server ... trying to connect callee/receiver')
            io.to(calleePersonalCode).emit('pre-offer', data);
        }
    });

    socket.on('pre-offer-answer', (data) => {
        console.log('pre offer answer came');
        // console.log(data);

        const connectedPeer = connectedPeers.find((peerSocketId) => {
            return (peerSocketId === data.callerSocketId);   
        });

        if (connectedPeer) {
            io.to(data.callerSocketId).emit('pre-offer-answer', data);
        }
    });

    socket.on('webRTC-signalling', (data) => {
        const {connectedUserSocketId} = data;

        const connectedPeer = connectedPeers.find(
            (peerSocketId) => peerSocketId === connectedUserSocketId
        );

        if(connectedPeer) {
            io.to(connectedUserSocketId).emit('webRTC-signalling',data);
        }
    })

    //if internet connection lost
    socket.on('disconnect', () => {
        console.log('user disconnected');
        //console.log(socket.id);

        const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
            return peerSocketId !== socket.id;
        });

        connectedPeers = newConnectedPeers;
        console.log(connectedPeers);
    });
});




server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});