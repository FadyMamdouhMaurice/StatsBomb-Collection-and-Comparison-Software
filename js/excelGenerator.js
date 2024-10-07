/*function generateExcel(events) {
    console.log('generateExcel() called, events:', events);
    try {
        // Create the header row
        let ws_data = [["Time", "Event"]];

        // Loop through each event and parse it to add to the worksheet data
        events.forEach(event => {
            if (event) { // Check if event is not empty
                try {
                    let data = JSON.parse(event);
                    ws_data.push([data.time, data.Event || ""]);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
            }
        });

        // Create a new workbook and add the worksheet
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Events");

        // Write the workbook to a file
        XLSX.writeFile(wb, "myEvents.xlsx");
    } catch (e) {
        console.error('Error generating Excel:', e);
    }
}*/

function generateExcel(events) {
    //console.log('generateExcel() called, events:', events);
    try {
        // Create the header row, including extra columns
        let ws_data = [["Time", "Event", "Extra1", "Extra2", "Extra3", "Extra4", "Extra5", "Extra6"]];

        // Loop through each event and parse it to add to the worksheet data
        events.forEach(event => {
            if (event) { // Check if event is not empty
                try {
                    let data = JSON.parse(event);
                    ws_data.push([
                        data.time || "",
                        data.Event || "",
                        (data.extras && data.extras.extra1) || "", // Extras from the extras object
                        (data.extras && data.extras.extra2) || "",
                        (data.extras && data.extras.extra3) || "",
                        (data.extras && data.extras.extra4) || "",
                        (data.extras && data.extras.extra5) || "",
                        (data.extras && data.extras.extra6) || ""
                    ]);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
            }
        });

        // Create a new workbook and add the worksheet
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Events");

        // Write the workbook to a file
        XLSX.writeFile(wb, "myEvents.xlsx");
    } catch (e) {
        console.error('Error generating Excel:', e);
    }
}

