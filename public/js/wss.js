//web socket server
import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

///
export var encryptedData;
export var decryptedData;
///
let socketIO = null;

export const registerSocketEvents = (socket) => {

    socketIO = socket;

   // is called directly before the connection has been opened   (callbacks)
    socket.on('connect', () => {
        console.log('client sucessfully connected to socket.io server');
        console.log(socket.id);
        store.setSocketId(socket.id); //store the values in the store
        ui.updatePersonalCode(socket.id); //updating the frontend html
    });

    //////////////////////
    socket.on('encrypt_personal_code', (data) => {
        encryptedData = data;
        
        console.log('encryptedData: ' + encryptedData);
    });

    socket.on('decrypt_personal_code', (data) => {
        decryptedData = data;
        webRTCHandler.sendDecryptedData(data);
        console.log('encryptedData: ' + decryptedData);
    })

    //////////////////////

    //-----------------receiver/callee connection code-----------------
     socket.on('pre-offer',(data) => {
         console.log('receiver client sucessfully connected to socket.io ');
         //caller id
         console.log(data);
         webRTCHandler.handlePreOffer(data);
     });
     
     
     socket.on('pre-offer-answer', (data) => {
         webRTCHandler.handlePreOfferAnswer(data);
     });
//-------------3. sending webrrct offer------------------listener
     socket.on('webRTC-signalling', (data) => {
        switch (data.type) {
            case constants.webRTCSignalling.OFFER:
                webRTCHandler.handleWebRTCOffer(data);
                break;
            case constants.webRTCSignalling.ANSWER:
                webRTCHandler.handleWebRTCAnswer(data);
                break;
            case constants.webRTCSignalling.ICE_CANDIDATE:
                webRTCHandler.handleWebRTCCandidate(data);
                break;
             
            default:
                return;
        }
    });
};
//-------------------sending offer to to server-------------------------
export const sendPreOffer = (data) => {
    console.log('offer sent to server from caller');
    socketIO.emit('pre-offer', data);
}

export const sendPreOfferAnswer = (data) => {
    socketIO.emit('pre-offer-answer', data);
};

//-------------3. sending webrrct offer------------------emitting event to server
export const sendDataUsingWebRTCSignallling = (data) => {
    socketIO.emit('webRTC-signalling', data);
};
 
/////////////////////////
export const encryptPersonalCode = (data) => {
    socketIO.emit('encrypt_personal_code', data);
};

export const decryptPersonalCode = (data) => {
    socketIO.emit('decrypt_personal_code', data);
};

/////////////////////////