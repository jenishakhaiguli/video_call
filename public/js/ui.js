import * as constants from "./constants.js";
import * as elements from "./elements.js";

//showing personal code
export const updatePersonalCode = (personalCode) => {
    const personalCodeParagraph = document.getElementById("personal_code_paragraph");
    //showing personal code
    personalCodeParagraph.innerHTML = personalCode;     
};

export const updateLocalVideo = (stream) => {
    const localVideo = document.getElementById('local_video');
    localVideo.srcObject = stream;

    localVideo.addEventListener('loadedmetadata', () => {
        localVideo.play();
    });
};

export const showIncomingCallDialog = (callType, acceptCallHandler, rejectCallHandler) => {
    const callTypeInfo = callType === constants.callType.CHAT_PERSONAL_CODE? 'Chat': 'Video';
    

    const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptCallHandler, rejectCallHandler);
    //removing all dialogue inside html dialoge elements
    const dialog = document.getElementById('dialog');
     
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
    dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
    const callingDialog = elements.getCallingDialog(rejectCallHandler);
     //removing all dialogue inside html dialoge elements
     const dialog = document.getElementById('dialog');
     
    // dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
     dialog.appendChild(callingDialog);    
}

export const showInfoDialog = (preOfferAnswer) => {
    let infoDialog = null;
    if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        infoDialog = elements.getInfoDialog(
            'Call rejected',
            'Callee rejected your call'
        )
    }

    if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
        infoDialog = elements.getInfoDialog(
            'Callee not found',
            'Please check your personal code'
        )
    }


    if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
        infoDialog = elements.getInfoDialog(
            'Call is not possible',
            'Probably callee is busy please try again later'
        )
    }

    
if (infoDialog) {
    const dialog = document.getElementById('dialog');
    dialog.appendChild(infoDialog);

    setTimeout(()=> {
        removeAllDialogs();
    }, [2000]);
 }
};




//--------
export const removeAllDialogs = () => {
    const dialog = document.getElementById('dialog');
     
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
};



//ui helper function

const enableDashboard = () => {
    const dashboardBlocker = document.getElementById('dashboard_blur');
    if (!dashboardBlocker.classList.contains('display_none')){
        dashboardBlocker.classList.add('display_none');
    }
};

export const showCallElements = (callType) => {
    if(callType === constants.callType.VIDEO_PERSONAL_CODE){
        showVideoCallElements();
    }
};

const showVideoCallElements = () => {
    const callButtons = document.getElementById('call_buttons');
    showElement(callButtons);

    const placeholder = document.getElementById('video_placeholder');
    hideElement(placeholder);

    const remoteVideo = document.getElementById('remote_video');
    showElement(remoteVideo);

    const newMessageInput = document.getElementById('new_message');
    showElement(newMessageInput);
    disableDashboard();
};


const disableDashboard = () => {
    const dashboardBlocker = document.getElementById('dashboard_blur');
    if (dashboardBlocker.classList.contains('display_none')){
        dashboardBlocker.classList.remove('display_none');
    } 
};

const hideElement = (element) => {
    if(!element.classList.contains('display_none')){
        element.classList.add('display_none');
    }
};

const showElement = (element) => {
    if(element.classList.contains('display_none')){
        element.classList.remove('display_none');
    }
};