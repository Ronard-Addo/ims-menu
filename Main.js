// ==============
// IMPORT SECTION
// ==============
import { displayInventoryTable } from './viewTable.js';
import { displayProductSelectionForm } from './viewProducts.js';
import { loadUpdateTableForm } from './updateTable.js';
import { loadCreateTableForm } from './createTable.js';
import { statSelectionForm } from './stats.js';
import { analyticsDashboard } from './stats.js';


// ======================
// MAIN FORM FUNCTIONS
// ======================
//document.getElementById('submit-selection').addEventListener('click', handleSelection);

document.getElementById('selection-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleSelection();
});

window.addEventListener('load', () => {
    const tableName = localStorage.getItem('tableName');
    const currentView = localStorage.getItem('currentView');

    switch(currentView) {
        case "tableInputForm":
            loadTableInputForm();
            break;
        case "tableResultsPage":
            loadTableResultsPage(tableName);
            break
        case "inventoryTable":
            const tableData = JSON.parse(localStorage.getItem('tableData'));
            displayInventoryTable(tableData);
            break;
    }
});

export function loadInitialForm() {
    window.location.href = 'menu.html';
}

function handleSelection() {
    const selectedRadio = document.querySelector('input[name="option"]:checked');
    if (!selectedRadio) {
        alert("Please select an option.");
        return;
    }
    
    const selectedOption = selectedRadio.value;
    localStorage.setItem('selectedOption', selectedOption);

    if (selectedOption === 'viewTable') {
        loadTableInputForm();
    } else if (selectedOption === 'viewProductInformation') {
        loadTableInputForm();
    } else if (selectedOption === 'updateProduct') {
        loadTableInputForm();
    } else if (selectedOption === 'updateTable') {
        //updateTable();
        loadTableInputForm();
    } else if (selectedOption === 'createTable') {
        loadCreateTableForm();
    } else if (selectedOption === 'stats') {
        statSelectionForm();
    }
}

// ======================
// TABLE SELECTION FUNCTIONS
// ======================
function loadTableInputForm() {
    localStorage.setItem('currentView', 'tableInputForm');  

    const contentDiv = document.getElementById('dynamic-content');
    if (!contentDiv) {
        console.error("Element with id 'dynamic-content' not found.");
        return;
    }
    
    const formHTML = `
        <form id="table-input-form">
            <h2>Select one of the following options</h2>
            <div class="table-input-section">                    
                <div class="table-selection-section" id="table-selection-section">                    
                    <label>
                        <input type="radio" name="input-option" id="table-selection" value="table-selection" checked>
                        Select a table name
                    </label>
                    <div class="table-list-section" id="table-list-section"></div>
                </div>
                <div class="table-text-section">
                    <label id="table-text-label">
                        <input type="radio" name="input-option" id="text-input" value="text-input">
                        Search for similar table names
                    </label>
                    <div class="text-input-section" id="table-text-input-section">
                        <label for="text-input-field">Enter a table name to search for tables with similar names:</label>
                        <input type="text" name="text-input-field">
                    </div>
                </div>
            </div>
            <div class="button-container">
                <button type="button" id="submit-table-name" class="btn">Continue</button>
                <button type="button" id="back-button" class="btn back-btn">Back</button>
            </div>
        </form>
    `;
    
    contentDiv.innerHTML = formHTML;
    
    // Initialize visibility
    const tableListSection = document.getElementById('table-list-section');
    const textInputSection = document.getElementById('table-text-input-section');
    textInputSection.style.display = 'none';
    
    // Load initial table list
    getTableNames({option: "all-tables"}, "table-list-section");
    
    // Set up radio button event delegation
    document.getElementById('table-input-form').addEventListener('change', function(e) {
        if (e.target.name === 'input-option') {
            if (e.target.value === 'table-selection') {
                tableListSection.style.display = 'block';
                textInputSection.style.display = 'none';
                getTableNames({option: "all-tables"}, "table-list-section");
            } else {
                tableListSection.style.display = 'none';
                textInputSection.style.display = 'block';
            }
        }
    });
    
    // Set up button event listeners
    document.getElementById('submit-table-name').addEventListener('click', function() {
        localStorage.removeItem('currentView'); // Clear state
        handleRadioSelection(true);
    });
    
    document.getElementById('back-button').addEventListener('click', () => {
        localStorage.removeItem('currentView'); // Clear state
        loadInitialForm();
    });
}

function getTableNames(sentData, location) {
    localStorage.setItem('location', location);
    fetchData("displayTables", sentData);
}

function displayTableNames(tables, location = null) {
    location = location || localStorage.getItem('location');
    const contentDiv = document.getElementById(location);
    
    if (!contentDiv) {
        console.error(`Element with id '${location}' not found.`);
        return;
    }
    
    let optionsHTML = '';
    tables.forEach(table => {
        optionsHTML += `
            <div class="table-option">
                <label>
                    <input type="radio" name="table-radio" value="${table.name}" required>
                    ${table.name} (Rows: ${table.num_rows})
                </label>
            </div>
        `;
    });
    
    contentDiv.innerHTML = optionsHTML;
    localStorage.removeItem('location');
}

function getSelectedTable() {
    const selectedTableRadio = document.querySelector('input[name="table-radio"]:checked');
    if (!selectedTableRadio) {
        alert('Please select a table.');
        return null;
    }
    
    const tableName = selectedTableRadio.value;

    localStorage.setItem('tableName', tableName);
    return tableName;
}

function handleRadioSelection(tableForm) {
    const option = document.querySelector('input[name="input-option"]:checked').value;
    
    if (option === "text-input") {
        const tableName = document.querySelector('input[name="text-input-field"]').value.trim();
        if (!tableName) {
            alert('Please enter a table name to search');
            return;
        }
        loadTableResultsPage(tableName);
    } else {
        const selected = getSelectedTable();
        if (selected) {
            handleActionMap(selected);
        }
    }
}

function loadTableResultsPage(tableName) {
    const contentDiv = document.getElementById('dynamic-content');
    
    contentDiv.innerHTML = `
        <form id="table-results-page">
            <h2>Table Results</h2>
            <h3>Select a table to view its contents</h3>
            <div class="table-selection">
                <div class="table-list-section" id="results-table-list-section"></div>
            </div>
            <div class="button-container">
                <button type="button" id="back-button" class="btn back-btn">Back</button>
                <button type="button" id="tables-page-submit" class="btn">Submit</button>
            </div>
        </form>
    `;
    
    getTableNames(tableName, "results-table-list-section");
    
    document.getElementById('back-button').addEventListener('click', loadInitialForm);
    document.getElementById('tables-page-submit').addEventListener('click', function() {
        const selected = getSelectedTable();
        if (selected) {
            handleActionMap(selected);
        }
    });
}

// ======================
// ACTION HANDLING FUNCTIONS
// ======================
function handleActionMap(selected) {
    console.log("handleActionMap function invoked");

    //const sentData = {tableName: selected, test: "test"};

    //console.log(sentData);
    const selectedOption = localStorage.getItem('selectedOption');
    
    switch(selectedOption) {
        case "viewTable":
            fetchData("viewTable", selected);
            break;
        case "viewProductInformation":
            fetchData("getProducts", selected);
            break;
        case "updateProduct":
            fetchData("getProducts", selected);
            break;
        case "updateTable":
            loadUpdateTableForm();
            //fetchData("updateTable", selected);
            break;
    }
}

// ======================
// DATA FETCHING FUNCTIONS
// ======================
export function fetchData(action, sentData = null) {
    
    console.log("Sent data: ", sentData);

    console.log("Signal: ", sentData['signal']);

    const formData = new FormData();

    formData.append('sentData', JSON.stringify(sentData)); // Append as JSON string

   if (sentData['signal']) {
    formData.append('excelFile', sentData['excelFile']);
   }
    
    const actionMap = {
        displayTables: {
            destination: "get_tableNames.php",
            handler: displayTableNames
        },
        viewTable: {
            destination: "get_inventory.php",
            handler: displayInventoryTable
        },
        getProducts: {
            destination: "get_products.php",
            handler: displayProductSelectionForm
        },
        updateProducts: {
            destination: "update_product.php",
            handler: displayInventoryTable
        },
        updateTable: {
            destination: "update_table.php",
            handler: displayInventoryTable
        },
        createTable: {
            destination: "create_table.php",
            handler: displayInventoryTable
        },
        getStats: {
            destination: "analysis.php",
            handler: analyticsDashboard
        }
    };
    
    if (!actionMap[action]) {
        alert("Technical error detected");
        return;
    }
    
    let destination = actionMap[action].destination;
    console.log("Destination: ", destination);

    console.log("Handler: ", actionMap[action].handler);

    const contentDiv = document.getElementById('dynamic-content');
    
    fetch(destination, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log(data);
        actionMap[action].handler(data);
    })
    .catch(error => {
        contentDiv.innerHTML = `<p class="error">Error loading data: ${error.message}</p>`;
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.className = 'btn back-btn';
        backButton.addEventListener('click', loadInitialForm);
        contentDiv.appendChild(backButton);
    });
}

// ======================
// UTILITY FUNCTIONS
// ======================
function addBackButton() {
    const contentDiv = document.getElementById('dynamic-content');
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.className = 'btn back-btn';
    backButton.addEventListener('click', loadInitialForm);
    contentDiv.appendChild(backButton);
}