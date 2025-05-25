// ======================
// ANALYTICS FUNCTIONS
// ======================
export function statSelectionForm() {
    const contentDiv = document.getElementById('dynamic-content');
    
    contentDiv.innerHTML = `
        <form id="stat-selection-form">
            <h2>View Statistics About Your Inventory</h2>
            <div class="stats-checkbox-group">
                <label>
                    <input type="checkbox" name="stat" value="bestProduct">
                    🏆 Best Performing Product
                </label>
                <label>
                    <input type="checkbox" name="stat" value="bestTables">
                    📅 Best Performing Month(s)
                </label>
                <label>
                    <input type="checkbox" name="stat" value="totalItems">
                    📦 Total Inventory Items
                </label>
                <label>
                    <input type="checkbox" name="stat" value="lowStock">
                    ⚠️ Low Stock Product
                </label>
                <label>
                    <input type="checkbox" name="stat" value="highestValue">
                    💰 Highest Value Product
                </label>
                <label>
                    <input type="checkbox" name="stat" value="worstProduct">
                    🐢 Worst Performing Product
                </label>
            </div>
            <div class="button-container">
                <button type="button" id="submit-stats" class="btn">Continue</button>
                <button type="button" id="back-button" class="btn back-btn">Back</button>
            </div>
        </form>
    `;
    
    document.getElementById('submit-stats').addEventListener('click', loadStatInputForm);
    document.getElementById('back-button').addEventListener('click', loadInitialForm);
}

function loadStatInputForm() {
    const selectedStats = Array.from(document.querySelectorAll('input[name="stat"]:checked')).map(cb => cb.value);
    
    if (selectedStats.length === 0) {
        alert("Please select at least one statistic");
        return;
    }
    
    localStorage.setItem('selectedStats', JSON.stringify(selectedStats));
    
    const contentDiv = document.getElementById('dynamic-content');
    let formHTML = `
        <form id="stat-input-form">
            <h2>Select Time Ranges</h2>
    `;
    
    selectedStats.forEach(stat => {
        formHTML += `
            <div class="stat-section">
                <h3>${getStatDisplayName(stat)}</h3>
                <div class="time-range-group">
                    <label>
                        <input type="radio" name="timeRange_${stat}" value="all-time" checked>
                        All-time
                    </label>
                    <label>
                        <input type="radio" name="timeRange_${stat}" value="specific">
                        Specific time
                    </label>
                    <div class="specific-time-input" id="specific_${stat}" style="display: none;">
                        <label>Enter table name (MM/YYYY or MM/YYYY-TableName):</label>
                        <input type="text" name="specificTime_${stat}" 
                            pattern="(0[1-9]|1[0-2])\/\d{4}(-\w+)?" 
                            title="Format: MM/YYYY or MM/YYYY-TableName">
                    </div>
                </div>
            </div>
        `;
    });
    
    formHTML += `
            <div class="button-container">
                <button type="button" id="submit-analysis" class="btn">Generate Report</button>
                <button type="button" id="back-button" class="btn back-btn">Back</button>
            </div>
        </form>
    `;
    
    contentDiv.innerHTML = formHTML;
    
    selectedStats.forEach(stat => {
        const radios = document.querySelectorAll(`input[name="timeRange_${stat}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById(`specific_${stat}`).style.display = 
                    this.value === 'specific' ? 'block' : 'none';
            });
        });
    });
    
    document.getElementById('submit-analysis').addEventListener('click', sendAnalyticsData);
    document.getElementById('back-button').addEventListener('click', statSelectionForm);
}

function getStatDisplayName(statKey) {
    const names = {
        'bestProduct': '🏆 Best Performing Product',
        'bestTables': '📅 Best Performing Month(s)',
        'totalItems': '📦 Total Inventory Items',
        'lowStock': '⚠️ Low Stock Product',
        'highestValue': '💰 Highest Value Product',
        'worstProduct': '🐢 Worst Performing Product'
    };
    return names[statKey] || statKey;
}

function sendAnalyticsData() {
    const selectedStats = JSON.parse(localStorage.getItem('selectedStats'));
    const requestData = {};
    
    for (const stat of selectedStats) {
        const checkedRadio = document.querySelector(`input[name="timeRange_${stat}"]:checked`);
        
        if (!checkedRadio) {
            alert(`Please select a time range for ${getStatDisplayName(stat)}`);
            return;
        }
        
        const time = checkedRadio.value;
        
        if (time === 'specific') {
            const textInput = document.querySelector(`input[name="specificTime_${stat}"]`).value;
            if (!textInput) {
                alert("Missing text field values. Please enter a table name for all displayed text fields");
                return;
            }
            requestData[stat] = textInput;
        } else {
            requestData[stat] = time;
        }
    }
    
    const contentDiv = document.getElementById('dynamic-content');
    contentDiv.innerHTML = '<div class="loading-spinner">Generating report...</div>';
    
    fetchData("getStats", requestData);
}

export function analyticsDashboard(statsData) {
    const contentDiv = document.getElementById('dynamic-content');
    const data = statsData || {};
    
    contentDiv.innerHTML = `
        <div class="inventory-stats">
            <h2>Inventory Analytics Dashboard</h2>
            <div class="stats-grid">
                ${data.bestProduct ? `
                <div class="stat-card">
                    <h3>🏆 Best Performing Product</h3>
                    <p class="stat-value">${data.bestProduct}</p>
                    <p class="stat-description">Highest sales volume</p>
                </div>
                ` : ''}
                
                ${data.bestTables ? `
                <div class="stat-card">
                    <h3>📅 Best Performing Month(s)</h3>
                    <p class="stat-value">${Array.isArray(data.bestTables) ? data.bestTables.join(', ') : data.bestTables}</p>
                    <p class="stat-description">Peak profit table(s)</p>
                </div>
                ` : ''}
                
                ${data.totalItems ? `
                <div class="stat-card">
                    <h3>📦 Total Inventory Items</h3>
                    <p class="stat-value">${data.totalItems}</p>
                    <p class="stat-description">Across all product categories</p>
                </div>
                ` : ''}
                
                ${data.lowStockProduct ? `
                <div class="stat-card">
                    <h3>⚠️ Low Stock Product</h3>
                    <p class="stat-value">${data.lowStockProduct} (${data.lowStockAmount})</p>
                    <p class="stat-description">Lowest stock item</p>
                </div>
                ` : ''}
                
                ${data.highestValueProduct ? `
                <div class="stat-card">
                    <h3>💰 Highest Value Product</h3>
                    <p class="stat-value">${data.highestValueProduct} ($${data.highestValuePrice})</p>
                    <p class="stat-description">By selling price</p>
                </div>
                ` : ''}
                
                ${data.worstProduct ? `
                <div class="stat-card">
                    <h3>🐢 Worst Performing Product</h3>
                    <p class="stat-value">${data.worstProduct}</p>
                    <p class="stat-description">Lowest sales volume</p>
                </div>
                ` : ''}
            </div>
            <div class="button-container">
                <button type="button" id="back-button" class="btn back-btn">Back to Main Menu</button>
            </div>
        </div>
    `;
    
    document.getElementById('back-button').addEventListener('click', loadInitialForm);
}