let seconds = 0;
let interval;
let collectedKeypoints = [];

const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    });

function startTimer() {
    interval = setInterval(() => {
        seconds++;
        document.getElementById("timer").innerText =
            "เวลา: " + seconds + " วินาที";
    }, 1000);
}

startTimer();

function stopExercise() {
    clearInterval(interval);

    fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user: "student01",
            keypoints: collectedKeypoints,
            duration: seconds
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerText =
            "AI วิเคราะห์ว่า: " + data.prediction;
    });
}