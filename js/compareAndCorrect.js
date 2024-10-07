// Assume you have a function to read and parse the Excel file
function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const data = event.target.result;

                // Check if the file is an Excel file or CSV file
                const fileExtension = file.name.split('.').pop().toLowerCase();
                let workbook;

                if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                    workbook = XLSX.read(data, { type: 'binary' });
                } else if (fileExtension === 'csv') {
                    workbook = XLSX.read(data, { type: 'binary', raw: true });
                } else {
                    throw new Error('Unsupported file format. Please upload an Excel or CSV file.');
                }

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Convert the Excel data into an array of objects
                const formattedData = excelData.slice(1).map(row => ({
                    time: row[0],  // Time column
                    event: row[1], // Event column
                    extra1: row[2] || '', // Extra1 column
                    extra2: row[3] || '', // Extra2 column
                    extra3: row[4] || '', // Extra3 column
                    extra4: row[5] || '', // Extra4 column
                    extra5: row[6] || '', // Extra5 column
                    extra6: row[7] || '',  // Extra6 column
                    comment: row[8], // Comment column

                }));

                // Create the final structure
                const eventStructure = formattedData.map(event => ({
                    time: event.time,
                    Event: event.event,
                    extra1: event.extra1,
                    extra2: event.extra2,
                    extra3: event.extra3,
                    extra4: event.extra4,
                    extra5: event.extra5,
                    extra6: event.extra6,
                    comment: event.comment
                }));

                // Log the event structure to check if extras are present
                //console.log('Event Structure with Extras:', eventStructure);

                resolve(eventStructure);
            } catch (error) {
                reject(new Error(`Error reading file: ${error.message}`));
            }
        };

        reader.onerror = function (error) {
            reject(new Error(`Error reading file: ${error.message}`));
        };

        // Read the file as binary string
        reader.readAsBinaryString(file);
    });
}

// Function to compare collected data with Excel data
let eventsArray = []; // Initialize an empty array globally or outside the function
function compareEvents(userEvent) {
    // Step 1: Initialize Variables
    //console.log("Step 1: Initializing user events");
    // If userEvent is an array, use it; otherwise, treat it as a single event and push to eventsArray
    if (Array.isArray(userEvent)) {
        eventsArray = [...eventsArray, ...userEvent]; // Add all events from userEvent to eventsArray
    } else {
        eventsArray.push(userEvent); // Add a single event to eventsArray
    }

    //console.log("User Events Array:", eventsArray);

    // Step 2: Retrieve correctEvents (model answer) from localStorage
    //console.log("Step 2: Retrieving correct events from localStorage");
    let correctEvents = JSON.parse(localStorage.getItem('correctEvents'));
    //console.log("Correct Events Array:", correctEvents);

    // Step 3: Initialize the results object
    //console.log("Step 3: Initializing results object");
    const results = {
        wrongEvents: [],
        extraEvents: [],
        missingEvents: [],
    };

    // Step 4: Helper function to parse time strings to seconds
    function parseTimeToSeconds(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        //console.log(`Parsing time: ${timeStr} to seconds: ${totalSeconds}`);
        return totalSeconds;
    }

    // Step 5: Helper function to compare extra fields
    function compareExtras(userEvent, correctEvent) {
        //console.log(`Comparing extras for User Event: ${userEvent.time}, Correct Event: ${correctEvent.time}`);
        const extras = ['extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'extra6'];
        const mismatchedExtras = [];

        for (const extra of extras) {
            const userExtra = userEvent.extras[extra]; // If extras are inside userEvent.extras
            const correctExtra = correctEvent[extra];

            //console.log(`Comparing ${extra}: User Extra = ${userExtra}, Correct Extra = ${correctExtra}`);

            if ((userExtra === undefined || userExtra === '' || userExtra === null ) &&
                (correctExtra === undefined || correctExtra === '' || correctExtra === null)) {
                //console.log(`Both extras are undefined or empty for ${extra}. They match.`);
                continue;
            }

            if (userExtra !== correctExtra) {
                //console.log(`Mismatch in ${extra}: User Extra = ${userExtra}, Correct Extra = ${correctExtra}`);
                mismatchedExtras.push({
                    extraField: extra,
                    userExtra,
                    correctExtra
                });
            }
        }
        return mismatchedExtras;
    }

    // Step 6: Iterate through user events and check against correct events
    eventsArray.forEach((userEvent) => {
        const userEventTimeInSeconds = parseTimeToSeconds(userEvent.time);
        let isMatched = false;
        //console.log(`\nChecking User Event: ${userEvent.Event} at ${userEvent.time}`);

        // Step 7: Find all correct events within the 2-second tolerance
        const matchingCorrectEvents = correctEvents
            .map(correctEvent => {
                const correctEventTimeInSeconds = parseTimeToSeconds(correctEvent.time);
                const timeDifference = Math.abs(userEventTimeInSeconds - correctEventTimeInSeconds);
                return { correctEvent, timeDifference };
            })
            .filter(({ timeDifference }) => timeDifference <= 2) // Only events within 2 seconds
            .sort((a, b) => a.timeDifference - b.timeDifference); // Sort by smallest time difference

        // Step 8: If matches are found, prioritize by smallest time difference
        if (matchingCorrectEvents.length > 0) {
            const closestMatch = matchingCorrectEvents[0].correctEvent;
            const closestTimeDifference = matchingCorrectEvents[0].timeDifference;

            //console.log(`Closest match found: User Event "${userEvent.Event}" matches Correct Event "${closestMatch.Event}" with a time difference of ${closestTimeDifference}`);

            // Step 9: Compare event type (case insensitive)
            if (userEvent.Event.toLowerCase() === closestMatch.Event.toLowerCase()) {
                // Step 10: Check extras only if the event type matches
                const mismatchedExtras = compareExtras(userEvent, closestMatch);
                const isExtrasMismatch = mismatchedExtras.length > 0;
                //console.log(`Extras mismatch check: ${isExtrasMismatch ? 'Mismatch' : 'Match'}`);

                if (isExtrasMismatch) {
                    results.wrongEvents.push({
                        time: userEvent.time,
                        UserEvent: userEvent.Event,
                        correctEvent: closestMatch.Event,
                        error: 'الاكشن صح بس الاكســـــــــتـــــــــرا غلط',
                        mismatchedExtras
                    });
                    //console.log(`Added to wrong events: ${JSON.stringify(results.wrongEvents[results.wrongEvents.length - 1])}`);
                }

                // Step 11: Remove the matched correct event from the array to prevent further matches
                const correctIndexInOriginalArray = correctEvents.indexOf(closestMatch);
                if (correctIndexInOriginalArray > -1) {
                    correctEvents.splice(correctIndexInOriginalArray, 1); // Removing matched event
                    //console.log(`Step 11:Removed matched event from correctEvents array:`, closestMatch);
                }

                isMatched = true;
            }
        }

        // Step 12: Handle unmatched user events (extra events)
        if (!isMatched) {
            //console.log(`No match found for User Event: ${userEvent.Event}. Added to extra events.`);
            results.extraEvents.push({
                time: userEvent.time,
                Event: userEvent.Event,
                error: 'Extra event not in the correct list.'
            });
        }
    });

    findMissingEvents(correctEvents, eventsArray, userEvent.time, results);

    // Step 14: Generate summary message
    //console.log("Generating summary message");
    let summaryMessage = 'خــــــــــلــــــــــي بـــــــــــــــــــالك' + '\n\n';

    if (results.extraEvents.length > 0) {
        summaryMessage += ` :الاكشنات دي زيـــــــــــــــادة\n` + results.extraEvents.map(event =>
            `-- Time: ${event.time} :زيادة في الوقت ده ${event.Event} انت عملت اكشن`
        ).join('\n') + '\n\n';
    }

    if (results.wrongEvents.length > 0) {
        summaryMessage += `:الاكشنات دي فيها اكستــــــــــرا غــــــــــلــــــــــط\n` + results.wrongEvents.map(event => {
            let extraDetails = '';
            if (event.mismatchedExtras.length > 0) {
                extraDetails = `\n  ${event.mismatchedExtras.map(extra =>
                    `${extra.correctExtra || 'undefined'} = بس الاكسترا المفروض تبقى <--- ${extra.userExtra || 'undefined'} = ${extra.extraField} انت عملت الـ`
                ).join('\n')}\n`;

            }   
            return `-- Time: ${event.time} :في الوقت ده ${event.UserEvent} انت عملت اكشن ${extraDetails}`;
        }).join('\n') + '\n\n';
    }

    if (results.missingEvents.length > 0) {
        summaryMessage += `:أنت مـــــعـــــمـــــلـــــتـــــش الاكشنات دي\n` + results.missingEvents.map(event =>
            `-- Time: ${event.time} :في الوقت ده ${event.Event} :المفروض تعمل اكشن  (Comment: ${event.comment || 'No comment'})`
        ).join('\n') + '\n\n';
    }
    // Step 14: Show the alert box with the detailed summary message only if there are messages
    if (results.extraEvents.length > 0 || results.wrongEvents.length > 0 || results.missingEvents.length > 0) {
        showAlert(summaryMessage);
    }

    /*if (userEvent.Event == 'Half End') {
        downloadComparisonResults(results);
    }*/
    // Final Output
    return results;
}
 function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');

    // Set the alert message with HTML line breaks
    alertMessage.innerHTML = message.replace(/\n/g, '<br>');

    // Display the alert box
    alertBox.style.display = 'block';
}
function closeAlert() {
    const alertBox = document.getElementById('alertBox');

    // Hide the alert box
    alertBox.style.display = 'none';
}

// Function to find missing events
function findMissingEvents(correctEvents, userEvents, thresholdTime, results) {
    const missingEvents = [];
    const thresholdTimeInSeconds = parseTimeToSeconds(thresholdTime);

    correctEvents.forEach(correctEvent => {
        const correctEventTimeInSeconds = parseTimeToSeconds(correctEvent.time);

        // Check if the correct event time is before the threshold time
        if (correctEventTimeInSeconds < thresholdTimeInSeconds) {
            // Check if there's a matching user event
            const hasMatchedUserEvent = userEvents.some(userEvent => {
                const userEventTimeInSeconds = parseTimeToSeconds(userEvent.time);
                return userEvent.Event.toLowerCase() === correctEvent.Event.toLowerCase() &&
                    Math.abs(userEventTimeInSeconds - correctEventTimeInSeconds) <= 2; // Allowing 2 seconds difference
            });

            // If no matching user event is found, consider it a missing event
            if (!hasMatchedUserEvent) {
                console.log(`Missing Correct Event: ${correctEvent.Event} at ${correctEvent.time}`);
                results.missingEvents.push({
                    time: correctEvent.time,
                    Event: correctEvent.Event,
                    comment: correctEvent.comment || '' // Assuming correctEvent may have a comment field
                });
            }
        }
    });
    return missingEvents;
}