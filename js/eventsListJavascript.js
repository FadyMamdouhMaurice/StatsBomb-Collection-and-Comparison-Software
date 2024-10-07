// Convert seconds to HH:MM:SS format, ignoring milliseconds
function formatEventTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);  // Round to the nearest second

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;  // Return only HH:MM:SS
}

// Convert HH:MM:SS format to seconds
function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

// Sort the events array by time before displaying
function sortEventsByTime(events) {
    return events.slice().sort((a, b) => {
        const timeA = JSON.parse(a).time;
        const timeB = JSON.parse(b).time;
        return timeStringToSeconds(timeA) - timeStringToSeconds(timeB);
    });
}

// Render the sorted events list
function renderEvents() {
    const sortedEvents = sortEventsByTime(events);

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear existing list

    sortedEvents.forEach(eventJson => {
        const event = JSON.parse(eventJson);
        addEventToList(event.time, event.Event, timeStringToSeconds(event.time), false, event.extras); // Pass extras here
    });
}

userEventsArray = []; // Initialize an empty array globally or outside the function
function addEventToList(time, eventName, eventTimeInSeconds, isHighlighted = false, extras = {}) {
    const eventList = document.getElementById('eventList');

    // Create a new event item
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    if (isHighlighted) {
        eventItem.classList.add('highlighted');
    }

    // Create elements for time and event name
    const timeElement = document.createElement('div');
    timeElement.textContent = time;
    timeElement.className = 'event-time'; // Optional class for styling

    const eventNameElement = document.createElement('div');
    eventNameElement.textContent = eventName;
    eventNameElement.className = 'event-name'; // Optional class for styling

    // Store event time as a data attribute for syncing
    eventItem.setAttribute('data-time', eventTimeInSeconds);

    // Add click event to seek video to event time
    // Modify this section in addEventToList to handle click event
    eventItem.addEventListener('click', function () {
        const videoNode = document.querySelector('video');
        videoNode.currentTime = eventTimeInSeconds;

        // Get all event items directly from the DOM
        const allEventItems = document.querySelectorAll('.event-item');

        // Highlight the clicked event
        highlightEventItem(allEventItems, [...allEventItems].indexOf(eventItem));

        // Debug: Check if extras are being passed
        //console.log("Clicked event's extras:", extras);

        // Display the extras associated with this event
        if (extras && Object.keys(extras).length > 0) { // Ensure extras are valid
            displayExtrasForEvent(extras);
        } else {
            //console.log("No extras found or extras are empty.");
            clearExtrasDisplay();
        }
    });



    // Append time and event name to the event item
    eventItem.appendChild(timeElement);
    eventItem.appendChild(eventNameElement);

    // Append the event item to the event list
    eventList.appendChild(eventItem);

    // Call the function to add extra details
    displayExtrasForEvent(extras, eventTimeInSeconds);

    // Scroll to the end of the list
    scrollToEnd();

    userEventsArray.push({
        time: time,
        eventName: eventName,
        eventTimeInSeconds: eventTimeInSeconds,
        extras: extras
    });
    localStorage.setItem('userEventsArray', JSON.stringify(userEventsArray)); // Save to localStorage
}

/*function addExtraToList(extras = {}, eventTimeInSeconds) {
    //console.log(extras);
    const extraDetails = document.getElementById('extraDetails');

    // Ensure extras is a non-null object
    if (typeof extras !== 'object' || extras === null) {
        //console.error('extras is not a valid object:', extras);
        return; // Exit the function if extras is not valid
    }

    // Iterate over each key-value pair in the extras object
    Object.entries(extras).forEach(([key, value]) => {
        if (value !== null) { // Check to avoid adding null values
            // Create a new extra item for each attribute
            const extraItem = document.createElement('div');
            extraItem.className = 'extra-item';
            
            // Create the extra element for the value
            const extraElement = document.createElement('div');
            extraElement.textContent = `${key}: ${value}`;
            extraElement.className = 'event-extra'; // Optional class for styling

            // Append the value to the extra item
            extraItem.appendChild(extraElement);

            // Add click event to seek video to event time
            extraItem.addEventListener('click', function () {
                const videoNode = document.querySelector('video');
                videoNode.currentTime = eventTimeInSeconds;
            });

            // Append the extra item to the extra details section
            extraDetails.appendChild(extraItem);
        }
    });
}
*/
// Function to scroll the event list to the end
function scrollToEnd() {
    const eventList = document.querySelector('.event-list');
    eventList.scrollLeft = eventList.scrollWidth;
}

// Function to delete the highlighted event
function deleteHighlightedEvent() {
    const highlightedItem = document.querySelector('.event-item.highlighted');
    if (highlightedItem) {
        const eventTimeInSeconds = parseFloat(highlightedItem.getAttribute('data-time'));

        // Convert event time from DOM (in seconds) to HH:MM:SS
        const eventTimeFormatted = formatEventTime(eventTimeInSeconds);
        //console.log('Event Time from DOM (formatted):', eventTimeFormatted);

        // Find the index of the event in the events array
        const eventIndex = events.findIndex(e => {
            const parsedEvent = JSON.parse(e);
            //console.log('Checking against event in array:', parsedEvent.time);

            // Compare the formatted HH:MM:SS times as strings
            return parsedEvent.time === eventTimeFormatted;
        });

        //console.log('Found Event Index:', eventIndex); // Log the index found (-1 means not found)

        // If the event is found, remove it from the events array
        if (eventIndex !== -1) {
            events.splice(eventIndex, 1);  // Remove the event from the array
            eventsArray.splice(eventIndex, 1);  // Remove the event from the array

            //console.log('Event removed from the array:', events);
        }

        // Remove the highlighted item from the DOM
        highlightedItem.remove();
        //console.log('Event removed from the DOM');
    } else {
        //console.log('No highlighted event to delete');
    }
}

// Function to sync events with video time and display corresponding extras
function syncEventWithVideoTime(currentTime) {
    const eventItems = document.querySelectorAll('.event-item');
    let lastMatchedEvent = null; // To store the matched event if found
    let lastMatchedIndex = -1;   // To track the index of the matched event

    eventItems.forEach((item, index) => {
        const eventTime = parseFloat(item.getAttribute('data-time'));

        // Allow a small tolerance (e.g., 0.5 seconds) for time matching
        if (Math.abs(eventTime - currentTime) <= 0.5) {
            lastMatchedEvent = JSON.parse(events[index]); // Store the matched event
            lastMatchedIndex = index;  // Store the matched index
            highlightEventItem(eventItems, index); // Highlight the matched event
        }
    });

    // If a matching event is found, display its extras
    if (lastMatchedEvent && lastMatchedEvent.extras) {
        //console.log("Syncing extras for event:", lastMatchedEvent.extras);
        displayExtrasForEvent(lastMatchedEvent.extras);
    } else {
        //console.log("No matching extras found during sync.");
        clearExtrasDisplay();
    }


}

// Function to display extras for a specific event
/*function displayExtrasForEvent(extras) {
    const extraDetails = document.getElementById('extraDetails');
    extraDetails.innerHTML = ''; // Clear previous extras

    //console.log("Displaying extras:", extras); // Debug to check what is being displayed

    // Iterate over each key-value pair in the extras object
    Object.entries(extras).forEach(([key, value]) => {
        if (value !== null) { // Check to avoid adding null values
            // Create a new extra item for each attribute
            const extraItem = document.createElement('div');
            extraItem.className = 'extra-item';

            // Create the extra element for the value
            const extraElement = document.createElement('div');
            extraElement.textContent = `${key}: ${value}`;
            extraElement.className = 'event-extra'; // Optional class for styling

            // Append the value to the extra item
            extraItem.appendChild(extraElement);

            // Append the extra item to the extra details section
            extraDetails.appendChild(extraItem);
        }
    });
    if (!extraDetails) {
        //console.error("Error: Extra details container not found in DOM.");
    } else {
        //console.log("Extra details container found:", extraDetails);
    }

}
*/
function displayExtrasForEvent(extras = {}, eventTimeInSeconds = null) {
    const extraDetails = document.getElementById('extraDetails');
    extraDetails.innerHTML = ''; // Clear previous extras

    if (typeof extras !== 'object' || extras === null) {
        console.error('extras is not a valid object:', extras);
        return; // Exit if extras are not valid
    }

    Object.entries(extras).forEach(([key, value]) => {
        if (value !== null) { // Check to avoid adding null values
            const extraItem = document.createElement('div');
            extraItem.className = 'extra-item';

            const extraElement = document.createElement('div');
            extraElement.textContent = `${key}: ${value}`;
            extraElement.className = 'event-extra'; // Optional class for styling

            extraItem.appendChild(extraElement);

            if (eventTimeInSeconds !== null) {
                extraItem.addEventListener('click', function () {
                    const videoNode = document.querySelector('video');
                    videoNode.currentTime = eventTimeInSeconds;
                });
            }

            extraDetails.appendChild(extraItem);
        }
    });
}

// Function to clear the extras display
function clearExtrasDisplay() {
    const extraDetails = document.getElementById('extraDetails');
    extraDetails.innerHTML = ''; // Clear extras
}

// Function to highlight the matched event item and scroll to it
function highlightEventItem(eventItems, index) {
    // First, remove highlighting from all items
    eventItems.forEach(item => item.classList.remove('highlighted'));

    // Highlight the matched event
    const itemToHighlight = eventItems[index];
    itemToHighlight.classList.add('highlighted');

    // Scroll to the highlighted item
    itemToHighlight.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Sync the video time every time the video updates (e.g., use `timeupdate` event)
const videoNode = document.querySelector('video');
videoNode.addEventListener('timeupdate', function () {
    syncEventWithVideoTime(videoNode.currentTime);
});