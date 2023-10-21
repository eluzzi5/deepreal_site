let introSection, recordSection;
let webcamView, preview, turnOnButton, startButton, stopButton;
let pleaseWait, moveForward, moveBackward, identity, name;
let playbackView, playback, redoButton, uploadButton;

function setupWebcam() {
    introSection = document.getElementById("intro_section");
    recordSection = document.getElementById("record_section");

    webcamView = document.getElementById("webcam_view");
    preview = document.getElementById("webcam_preview");
    turnOnButton = document.getElementById("turn_on_button");
    startButton = document.getElementById("start_button");
    stopButton = document.getElementById("stop_button");

    pleaseWait = document.getElementById("please_wait");
    moveForward = document.getElementById("move_forward");
    moveBackward = document.getElementById("move_backward");
    identity = document.getElementById("identity");
    name = document.getElementById("name");

    playbackView = document.getElementById("playback_view");
    playback = document.getElementById("playback");
    redoButton = document.getElementById("redo_button");
    uploadButton = document.getElementById("upload_button");


    turnOnButton.addEventListener("click", turnOnHandle);

    //startButton.addEventListener("click", startRecordingHandle);

    // stopButton.addEventListener("click", function() {
    //     toggleInputView(false);
    //     stop(preview.srcObject);
    // });

    redoButton.addEventListener("click", function() {
        toggleInputView(true);
        turnOnHandle()
    });

    uploadButton.addEventListener("click", async function() {
        playback.pause();

        upload();
            // let result = await upload();
            // console.log(result);
        // let json = JSON.parse(await result.statusText());
        // json["src_vid_url"] = playback.src;

        // let event = new CustomEvent('sessionStarted', {detail: json});
        // document.dispatchEvent(event);
    });

    startingView(true);
}

function startingView(first_start) {
    toggleInputView(true);
    toggleWebcamVideoElement(false);
    toggleWebcamSection(turnOnButton);

    if (!first_start) {
        turnOnHandle();
    }
}

function turnOnHandle() {
    toggleInputView(true);
    toggleWebcamVideoElement(false);
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(stream => {
        preview.srcObject = stream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;
        toggleWebcamSection(startButton);
        startRecordingHandle();
    })
}

// function startRecordingHandle() {
//     toggleWebcamSection(pleaseWait);
//     startRecording(preview.captureStream())
//         .then (recordedChunks => {
//             let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
//             playback.blob = recordedBlob;
//             playback.src = URL.createObjectURL(recordedBlob);

//             console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
//                 recordedBlob.type + " media.");
//         })
//         .catch(console.log);
// }

function startRecordingHandle() {
    toggleWebcamSection(pleaseWait);
    startRecording(preview.captureStream())
        .then (recordedChunks => {
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
            playback.blob = recordedBlob;
            playback.src = URL.createObjectURL(recordedBlob);

            console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
                recordedBlob.type + " media." + "URL: " + playback.src);
        })
        .catch(console.log);
}

function startRecording(stream) {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();

    setTimeout(() => {
        toggleWebcamSection(moveForward);
        setTimeout(() => {
            toggleWebcamSection(moveBackward);
            setTimeout(() => {
                toggleWebcamSection(identity);
                setTimeout(() => {
                    toggleWebcamSection(name);
                    }, 6000);
                }, 4000);
            }, 4000);
        }, 4000);

    setTimeout(() => {
        stop(preview.srcObject);
        toggleInputView(false);
        }, 20000);

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);
    });

    return stopped.then(() => data);
}
function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}

function toggleInputView(showWebcam) {
    if (showWebcam === true) {
        webcamView.style.display = "block";
        playbackView.style.display = "none";
    } else {
        webcamView.style.display = "none";
        playbackView.style.display = "block";
    }
}

function toggleWebcamVideoElement(showElement) {
    if (showElement === true) {
        preview.style.display = "block"
    } else {
        preview.style.display = "none"
    }
}

function toggleWebcamSection(buttonToShow) {
    for (let but of [turnOnButton, startButton, stopButton]) {
        if (but === buttonToShow) {
            but.style.display = "block";
        } else {
            but.style.display = "none";
        }
    }

    for (let sec of [pleaseWait, moveForward, moveBackward, identity, name]){
        if (sec === buttonToShow){
            sec.style.display = "block";

        }
        else {
            sec.style.display = "none";
        }
    }

    if ([startButton, stopButton, pleaseWait, moveForward, moveBackward, identity, name].includes(buttonToShow)) {
        introSection.style.display = "none";
        recordSection.style.display = "block";
    } else {
        introSection.style.display = "block";
        recordSection.style.display = "none";
    }

}


function upload() {
    // const url = `http://${get_server_url()}/upload`;
    const url = `https://af8ca607b3a0.ngrok.io/upload`;
    let file = new File([playback.blob], 'playback');

    const data = new FormData();
    data.append('user_video', file);

    return fetch(url, {
        method: 'post',
        body: data,
    }).then(
        data => data
    ).catch(
        except => console.log(except)
    )
}

