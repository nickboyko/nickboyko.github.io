// assigning elements
let fileAudio;
const audioElement = document.querySelector("audio");
const track = actx.createMediaElementSource(audioElement);
track.connect(masterGain);
const playButton = document.querySelector('#playFile');
const noUploadText = document.querySelector('#uploadFlag');
var fileUploaded = false;

// file upload handler, attaches to URL object and toggles playback button
function handleFiles(event) {
    var files = event.target.files;
    var fileurl = URL.createObjectURL(files[0]);
    $("#src").attr("src", fileurl);
    document.getElementById("audio").load();
    if (!fileUploaded) {
        fileUploaded = true;
        playButton.style.display = "block";
        noUploadText.style.display = "none";
    }

    // unused -- writes file to buffer 

    // var audioFile = fetch(fileurl)
    //     .then(res => res.arrayBuffer())
    //     .then(buffer => actx.decodeAudioData(buffer))
    //     .then(decodedBuffer => {
    //         fileAudio = decodedBuffer;
    //     })
}

// file upload listener
document.getElementById("sampleUpload").addEventListener("change", handleFiles, false);

// onclick event for play/pause button
playButton.addEventListener('click', () => {
    if (actx.state === "suspended") {
        actx.resume();
    }
    // playback flag to handle play/pause
    if (playButton.dataset.playing === "false") {
        audioElement.play();
        playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
        audioElement.pause();
        playButton.dataset.playing = "false";
    }
}, 
false, 
);
