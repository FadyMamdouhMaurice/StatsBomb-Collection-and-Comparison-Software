// Function to download the result as an Excel file
function downloadComparisonResults(results) {
    //get FeedBack Videos Folder path
    //const videosSavedFolder = JSON.parse(localStorage.getItem('videosSavedFolderPath')); // Retrieve the lineup from localStorage

    // Prepare data for the Excel file
    const worksheetData = [];

    // Add headers for the result data
    worksheetData.push(['Type', 'Time', 'User Event', 'Correct Event', 'Comment', 'Error', 'Video Path']);

    // Function to convert time to seconds
    function timeToSeconds(timeString) {
        return parseTimeToSeconds(timeString);
    }

    // Combine wrong, missing, and extra events into a single array for sorting
    const combinedResults = [
        ...results.wrongEvents.map(event => ({
            type: 'Wrong Event',
            time: event.time,
            event: event.Event || '',
            correctEvent: event.correctEvent || '',
            comment: event.comment || '',
            error: event.error || '',
            videoPath: generateVideoPath(event.time, event.correctEvent)
        })),
        ...results.missingEvents.map(event => ({
            type: 'Missing Event',
            time: event.time,
            event: '', // No user event for missing events
            correctEvent: event.Event || '',
            comment: event.comment || '',
            error: 'Missing event',
            videoPath: generateVideoPath(event.time, event.Event)
        })),
        ...results.extraEvents.map(event => ({
            type: 'Extra Event',
            time: event.time,
            event: event.Event || '',
            correctEvent: '', // No correct event for extra events
            comment: '',
            error: 'Extra event',
            videoPath: generateVideoPath(event.time, event.Event)
        }))
    ];

    // Sort combined results by time
    const sortedResults = combinedResults.sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

    // Add sorted results to the worksheet data
    sortedResults.forEach(event => {
        worksheetData.push([
            event.type,
            event.time,
            event.event,
            event.correctEvent,
            event.comment,
            event.error,
            event.videoPath
        ]);
    });

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparison Results');

    // Export the Excel file
    XLSX.writeFile(workbook, 'comparison_results.xlsx');
}

// Updated function to compare all user events with the correct events from the Excel file and download results
function parseTimeToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const totalSeconds = (+hours) * 3600 + (+minutes) * 60 + parseFloat(seconds);
    return totalSeconds;
}

async function compareAllUserEvents(userEvent) {
    try {
        const correctEvents = JSON.parse(localStorage.getItem('correctEvents')); // Retrieve correct events
        const results = {
            wrongEvents: [],
            missingEvents: [],
            extraEvents: [] // New array to track extra events
        };

        // userEvent appears to be an array of JSON strings, so we need to parse each string
        const parsedUserEvents = userEvent.map(event => {
            try {
                return JSON.parse(event); // Parse each individual string to JSON
            } catch (parseError) {
                throw new Error(`Invalid JSON in userEvent: ${event}`);
            }
        });

        // Get the latest user event time
        const latestUserEventTime = Math.max(...parsedUserEvents.map(event => {
            if (event.time) {
                return parseTimeToSeconds(event.time);
            } else {
                throw new Error('User event time is missing or invalid.');
            }
        }));

        // Compare user events with correct events
        parsedUserEvents.forEach(userEvent => {
            if (!userEvent.time) {
                results.wrongEvents.push({
                    time: 'N/A',
                    Event: userEvent.Event || '',
                    error: 'User event time is missing.'
                });
                return;
            }

            const userEventTimeInSeconds = parseTimeToSeconds(userEvent.time);

            const matchingCorrectEvents = correctEvents.filter(correctEvent => {
                if (!correctEvent.time) {
                    return false;
                }
                const correctEventTimeInSeconds = parseTimeToSeconds(correctEvent.time);
                const timeDifference = Math.abs(userEventTimeInSeconds - correctEventTimeInSeconds);
                return timeDifference <= 2; // 2 seconds tolerance
            });

            if (matchingCorrectEvents.length === 0) {
                // Event is classified as "extra"
                results.extraEvents.push({
                    time: userEvent.time,
                    Event: userEvent.Event,
                    error: 'No matching correct event within 2 seconds.' // Marked as extra
                });
            } else {
                const wrongEvent = matchingCorrectEvents.find(correctEvent => userEvent.Event !== correctEvent.Event);
                if (wrongEvent) {
                    results.wrongEvents.push({
                        time: userEvent.time,
                        Event: userEvent.Event,
                        correctEvent: wrongEvent.Event,
                        comment: wrongEvent.comment || '',
                        error: 'Incorrect event type at the given time.'
                    });
                }
            }
        });

        // Check for missing events
        correctEvents.forEach(correctEvent => {
            if (!correctEvent.time) return;

            const correctEventTimeInSeconds = parseTimeToSeconds(correctEvent.time);
            if (correctEventTimeInSeconds <= latestUserEventTime) {
                const matchingUserEvents = parsedUserEvents.filter(userEvent => {
                    if (!userEvent.time) return false;
                    const userEventTimeInSeconds = parseTimeToSeconds(userEvent.time);
                    const timeDifference = Math.abs(userEventTimeInSeconds - correctEventTimeInSeconds);
                    return timeDifference <= 2;
                });

                if (matchingUserEvents.length === 0) {
                    results.missingEvents.push({
                        time: correctEvent.time,
                        Event: correctEvent.Event,
                        comment: correctEvent.comment || ''
                    });
                }
            }
        });

        // Download the results as an Excel file
        downloadComparisonResults(results);
        processVideo(results);
        /*document.getElementById('chooseVideo').addEventListener('change', function (event) {
            const videoFile = event.target.files[0];
            const videoFilePath = videoFile.path;

            cutVideos(videoFilePath, results);
        });*/
        //console.log(results);
        return results;

    } catch (error) {
        console.error('Error comparing events:', error.message);
        alert(`Error: ${error.message}`);
    }
}
function generateVideoPath(eventTime, event) {
    // Replace colons with periods in variable1
    const formattedEventTime = eventTime.replace(/:/g, '.');
    const filePath = `C:\\FeedBack Videos\\${formattedEventTime}_${event}.mp4`;
    // Return the formula for Excel HYPERLINK function
    return { t: 's', f: `HYPERLINK("${filePath}", "Open Video")` };
}

// Function to call the Python script
/*function cutVideos(videoFilePath, result) {
    // Convert the result object to a JSON string
    const resultJson = JSON.stringify(result);

    // Get the Python script path
    const scriptPath = path.join(__dirname, 'cutting_video.py');

    // Run the Python script using child_process
    const pythonProcess = exec(`python3 ${scriptPath} ${videoFilePath} '${resultJson}'`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
}

// Example usage: Get the video file path from input
/*document.getElementById('chooseVideo').addEventListener('change', function (event) {
    const videoFile = event.target.files[0];
    const videoFilePath = videoFile.path;

    // Call the cutVideos function with the selected video and result object
    cutVideos(videoFilePath, result);
});*/