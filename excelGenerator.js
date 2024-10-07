function generateExcel(events) {
    console.log('generateExcel() called, texts:', events);
    try {
        let ws_data = [["Time","Event"]]; // Header row

        events.forEach(event => {
            if (event) { // Check if text is not empty
                try {
                    let data = JSON.parse(event);
                    let actions = data.actions;

                    actions.forEach(action => {
                        ws_data.push([formatTime(action.time), action.Event || ""]);
                    });
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
            }
        });

        // Create a new workbook and add the worksheet
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Actions");

        // Write workbook to file
        XLSX.writeFile(wb, "myEvents.xlsx");
    } catch (e) {
        console.error('Error generating Excel:', e);
    }
}