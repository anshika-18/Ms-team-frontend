export const getUserMediaPromise = (
    mediaConstraints)=> {

    const getUserMedia = 
        navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia;

    return new Promise((resolve, reject) => {
        getUserMedia(mediaConstraints, resolve, reject);
    });
}