
var theVideo = document.getElementById("videoPlayer");
document.onload = function(event){
console.log(theVideo);
}
document.onkeydown = function(event) {
    switch (event.keyCode) {
    case 38: event.preventDefault();
            audio_vol = theVideo.volume;
            if (audio_vol!=1) {
                try {
                    theVideo.volume = audio_vol + 0.02;
                }
                catch(err) {
                    theVideo.volume = 1;
                }
                
            }
            break;
    case 40: event.preventDefault();
            audio_vol = theVideo.volume;
            if (audio_vol!=0) {
                try {
                    theVideo.volume = audio_vol - 0.02;
                }
                catch(err) {
                    audio_element.volume = 0;
                }
            }
            break;
        case 37: event.preventDefault();
            
            vid_currentTime = theVideo.currentTime;
            theVideo.currentTime = vid_currentTime - 5;
            break;
        
        case 39:
            event.preventDefault();
            
            vid_currentTime = theVideo.currentTime;
            theVideo.currentTime = vid_currentTime + 5;
        break;
        case 32: event.preventDefault();
            if(theVideo.paused){
                theVideo.play();
            }else{
                theVideo.pause();
            }
        
    }
};