const SERVER = "ws://127.0.0.1:9696";
const socket = new WebSocket(SERVER);

var resp = null;

socket.onmessage = function(event) {
    resp = event.data;
    try {
        const parsedData = JSON.parse(resp);
        if (typeof parsedData === 'object' && parsedData !== null) {
            for (let label in parsedData) {
                // [host, port, protocol, desc]
                // servers[label] = [host, proto, 0]
                srv_info = [parsedData[label][0], null, parsedData[label][1], label, parsedData[label][2]];
                addServerIntoForm(srv_info, true);
            }
        } else {
            alert(resp);
        }
    } catch (error) {
        alert('Bad response.');
    }
};

socket.addEventListener('open', (event) => {
    console.log('WebSocket连接已建立');
    poll();
});

function poll() {
    socket.send('0');
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
function getHostFromInput () {
    const host = document.getElementById('hostInput').value;
    var port;
    if (document.getElementById('portInput').value !== "") {
        port = document.getElementById('portInput').value;
    } else {
        port = '-';
    }
    const protocol = document.getElementById('protocolSelect').value;
    const desc = document.getElementById('descInput').value;
    return [host, port, protocol, desc];
}

function addServerIntoForm(info_array, add_from_web) {
    const table = document.getElementById('serverList');
    const newRow = table.insertRow(-1);
    // Web: [host, port, protocol, desc]
    // Poll: [host, port, protocol, desc, latency]
    var host = info_array[0]
    const port = info_array[1]
    const proto = info_array[2]
    const desc = info_array[3]
    var lat = null;
    if (add_from_web == true) {
        if (info_array[4] >= 0) {
            lat = `${(info_array[4] * 1000).toFixed(2)} ms`;
        } else {
            lat = 'X';
        }
    } else {
        lat = '-';
        if (proto == 'tcp') {
            host = host + ':' + port;
        }
    }
    console.log(info_array);
    newRow.innerHTML = `<td>${host}</td><td>${proto}</td><td>${lat}</td><td>${desc}</td><td><button class="modal-btn remove-btn" onclick="removeServer(this.parentNode.parentNode)">DEL</button></td>`;

    // Close the modal
    closeAddServerModal();
}

function onclick_submit_srv() {
    srv_info = getHostFromInput();
    addServerIntoForm(srv_info, true);
}

// Remove a server from the list
function removeServer(row) {
    const table = document.getElementById('serverList');

    // TODO: Use WebSocket to notify the backend server about the removal

    // Remove the row from the table
    table.deleteRow(row.rowIndex - 1);
}

// TODO: Implement WebSocket logic to query and update the server list on page load/refresh