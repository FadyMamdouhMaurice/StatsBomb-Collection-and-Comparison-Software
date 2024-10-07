function timeStringToSeconds(time) {
    const [hh, mm, ss] = time.split(':').map(Number);
    return hh * 3600 + mm * 60 + ss;
}

function processVideo(result) {
    const videoInput = document.getElementById('chooseVideo');
    const videoFile = videoInput.files[0];

    if (!videoFile) {
        alert('Please select a video first.');
        return;
    }

    // Process each event in the result variable
    const allEvents = [...result.wrongEvents, ...result.missingEvents, ...result.extraEvents];

    allEvents.forEach(event => {
        const eventTime = timeStringToSeconds(event.time);
        const startTime = Math.max(0, eventTime - 2); // 2 seconds before event time
        const duration = 8; // 4 seconds (2 seconds before and after the event)

        // Send the data to Electron to process the video segment
        window.electronAPI.saveVideoSegment(videoFile.path, event.Event, startTime, duration);
    });
}
