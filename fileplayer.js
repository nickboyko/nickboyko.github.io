let fileAudio;
const audioElement = document.querySelector("audio");
const track = actx.createMediaElementSource(audioElement);
track.connect(masterGain);
const playButton = document.querySelector('#playFile');
const noUploadText = document.querySelector('#uploadFlag');
var fileUploaded = false;

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

    // var audioFile = fetch(fileurl)
    //     .then(res => res.arrayBuffer())
    //     .then(buffer => actx.decodeAudioData(buffer))
    //     .then(decodedBuffer => {
    //         fileAudio = decodedBuffer;
    //     })
}

document.getElementById("sampleUpload").addEventListener("change", handleFiles, false);


playButton.addEventListener('click', () => {
    if (actx.state === "suspended") {
        actx.resume();
    }

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
