//import { loadInitialForm } from './Main.js';
import { fetchData } from './Main.js';

// ======================
// CREATE TABLE FUNCTIONS
// ======================
export function loadCreateTableForm() {
    const contentDiv = document.getElementById('dynamic-content');
    contentDiv.innerHTML = `
        <form id="create-table-form">
            <h2>Create New Table from Excel File</h2>
            <div class="form-group">
                <label for="newTableName">Table Name:</label>
                <input type="text" id="newTableName" name="newTableName" required>
            </div>
            <div class="form-group">
                <label for="newExcelFile">Select Excel File:</label>
                <input type="file" id="newExcelFile" name="newExcelFile" accept=".xlsx, .xls" required>
            </div>
            <div id="create-table-message"></div>
            <div class="button-container">
                <button type="button" id="create-table-back" class="btn back-btn">Back</button>
                <button type="button" id="submit-create-table" class="btn">Create Table</button>
            </div>
        </form>
    `;
    
    document.getElementById('create-table-back').addEventListener('click', loadInitialForm);
    document.getElementById('submit-create-table').addEventListener('click', createTable);
}

function createTable() {
    const tableName = document.getElementById('newTableName').value.trim();
    const fileInput = document.getElementById('newExcelFile');
    const messageDiv = document.getElementById('create-table-message');
    
    if (!tableName) {
        messageDiv.innerHTML = '<div class="error">Please enter a table name</div>';
        return;
    }
    
    if (!fileInput.files.length) {
        messageDiv.innerHTML = '<div class="error">Please select an Excel file</div>';
        return;
    }
    
    const sentData = {tableName: tableName, excelFile: fileInput.files[0], signal: true };

    fetchData("createTable", sentData);

    messageDiv.innerHTML = '<div class="loading-spinner">Creating table...</div>';
    
}