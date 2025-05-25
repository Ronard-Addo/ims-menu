//import { loadInitialForm } from './Main.js';
import { fetchData } from './Main.js';

// ======================
// UPDATE TABLE FUNCTIONS
// ======================
function updateTable() {
    loadTableInputForm();
    console.log("finish");
}

export function loadUpdateTableForm() {
    const contentDiv = document.getElementById('dynamic-content');
    contentDiv.innerHTML = `
        <form id="update-table-form">
            <h2>Update Table via Excel File</h2>
            <div class="table-selection">
                <h3>Select Table to Update:</h3>
            </div>
            <div class="form-group">
                <label for="excelFile">Select Excel File:</label>
                <input type="file" id="excelFile" name="excelFile" accept=".xlsx, .xls" required>
                <small>File should match table structure</small>
            </div>
            <div id="upload-message"></div>
            <div class="button-container">
                <button type="button" id="back-button" class="btn back-btn">Back</button>
                <button type="button" id="submit-excel" class="btn">Upload & Update</button>
            </div>
        </form>
    `;
    
    document.getElementById('back-button').addEventListener('click', loadInitialForm);
    document.getElementById('submit-excel').addEventListener('click', handleFileUpload);
}

function handleFileUpload() {
    const fileInput = document.getElementById('excelFile');
    const messageDiv = document.getElementById('upload-message');
    
    if (!fileInput.files.length) {
        alert("Please select an Excel file");
        return;
    }
    
    messageDiv.innerHTML = '<div class="loading-spinner">Uploading and processing file...</div>';
    
    const tableName = localStorage.getItem('tableName');

    const sentData = {tableName: tableName, excelFile: fileInput.files[0], signal: true };

    console.log(sentData);

    fetchData("updateTable", sentData);
    
}