const socket = new WebSocket("ws://127.0.0.1:9696");

socket.onmessage = function(event) {
    const s_res = event.data;
    try {
        const parsedData = JSON.parse(s_res);
        if (typeof parsedData === 'object' && parsedData !== null) {
            // Server list
        } else {
            // Info
        }
    } catch (error) {
        alert('Bad response.');
    }
};

function getCurrentDateTimeString() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
    var day = currentDate.getDate().toString().padStart(2, '0');
    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');

    var dateTimeString = year + month + day + '-' + hours + minutes + seconds;

    return dateTimeString;
}

// Open the Add Server Modal
function openAddServerModal() {
    document.getElementById('addServerModal').style.display = 'block';
}

// Close the Add Server Modal
function closeAddServerModal() {
    document.getElementById('addServerModal').style.display = 'none';
}

// Validate PORT input
function validatePortInput() {
    const portInput = document.getElementById('portInput');
    const portValue = portInput.value;

    if (portValue !== "" && (isNaN(portValue) || parseInt(portValue) < 0 || parseInt(portValue) > 65535)) {
        alert("PORT must be a valid integer between 0 and 65535.");
        portInput.value = "";
    }
}

// Add a new server to the list
function addServer() {
    const timestamp = getCurrentDateTimeString();
    const host = document.getElementById('hostInput').value;
    var port;
    if (document.getElementById('portInput').value !== "") {
        port = document.getElementById('portInput').value;
    } else {
        port = '-';
    }
    const protocol = document.getElementById('protocolSelect').value;

    // TODO: Use WebSocket to send data to the backend server

    // Dummy code to add a new row to the table (replace this with WebSocket logic)
    const table = document.getElementById('serverList');
    const newRow = table.insertRow(-1);
    newRow.innerHTML = `<td>${host}</td><td>${port}</td><td>${protocol}</td><td>---</td><td>---</td><td><button class="modal-btn remove-btn" onclick="removeServer(this.parentNode.parentNode)">REMOVE</button></td><td>${timestamp}</td>`;

    // Close the modal
    closeAddServerModal();
}

// Remove a server from the list
function removeServer(row) {
    const table = document.getElementById('serverList');

    // TODO: Use WebSocket to notify the backend server about the removal

    // Remove the row from the table
    table.deleteRow(row.rowIndex - 1);
}

// TODO: Implement WebSocket logic to query and update the server list on page load/refresh