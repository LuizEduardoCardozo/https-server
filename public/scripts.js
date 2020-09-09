const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const peer = new Peer(undefined, {
    secure: true,
    host: 'peerjs-server-test-web.herokuapp.com',
})

const video = document.createElement('video');
video.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(video, stream)

    peer.on('call', (call) => {
        call.answer();
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
        call.on('close', () => video.remove());

    });


    socket.on('user-conected', userId => {
        connectToNewUser(userId, stream);
    })

});

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});
socket.emit('join-room', ROOM_ID, 101);

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', ( userVideoStream ) => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', (  ) => {
        video.remove()
    })
}
