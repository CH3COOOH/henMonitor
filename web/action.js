const SERVER = "ws://127.0.0.1:9696";
const socket = new WebSocket(SERVER);

var resp = null;

socket.onmessage = function(event) {
    resp = event.data;
    console.log(resp);
    if (['OK', 'SRV_ERR', 'BAD_REQ'].includes(resp)) {
        alert(resp);
        return 0;
    }
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
        return 0;
    } catch (error) {
        alert('Bad response.');
        return -1;
    }
};

socket.addEventListener('open', (event) => {
    console.log('WebSocket Connection Established :)');
    poll();
});

// --------------------
//   + Backend Communicate
// --------------------
function poll() {
    socket.send('0');
}

function update_srv_list(srv_info, isAdd=0) {
    // SEND: {op: -1/0, srv: [label, host, proto]}
    // GET: srv_info = [host, port, protocol, desc]
    var host = srv_info[0];
    const port = srv_info[1];
    const proto = srv_info[2];
    const desc = srv_info[3];
    if (proto == 'tcp') {
            host = host + ':' + port;
        }
    info_js = {'op': isAdd, 'srv':[desc, host, proto]};
    socket.send(JSON.stringify(info_js));
}
// --------------------
//   ^ Backend Communicate
// --------------------

// --------------------
//   + UI Controller
// --------------------
// Open the Add Server Modal
function openAddServerModal() {
    document.getElementById('addServerModal').style.display = 'block';
}

// Close the Add Server Modal
function closeAddServerModal() {
    document.getElementById('addServerModal').style.display = 'none';
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
// --------------------
//   ^ UI Controller
// --------------------

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
    var desc = `(${getCurrentDateTimeString()}) ${document.getElementById('descInput').value}`;
    // if (document.getElementById('descInput').value == '') {
    //     desc += ' HOST';
    // }
    return [host, port, protocol, desc];
}


// --------------------
//   + Button Action
// --------------------
function onclick_submit_srv() {
    srv_info = getHostFromInput();
    // [host, port, protocol, desc]
    update_srv_list(srv_info, 0);
    addServerIntoForm(srv_info, true);
}
// --------------------
//   - Button Action
// --------------------

// Remove a server from the list
function removeServer(row) {
    const table = document.getElementById('serverList');
    const label = row.cells[3].textContent;
    console.log(`Remove server ${label}`);
    table.deleteRow(row.rowIndex - 1);
    // GET: srv_info = [host, port, protocol, desc]
    update_srv_list(['','','',label], isAdd=-1);
}

// TODO: Implement WebSocket logic to query and update the server list on page load/refresh

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
