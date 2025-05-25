//import { loadInitialForm } from './Main.js';
import { displayInventoryTable } from './viewTable.js';
import { loadUpdateProductForm } from './updateProduct.js';

// ======================
// PRODUCT FUNCTIONS
// ======================
export function displayProductSelectionForm(products) {
    const contentDiv = document.getElementById('dynamic-content');
    
    let formHTML = `
        <form id="product-selection-form">
            <h2>Select Products</h2>
            <h3>Select at least one of the following products:</h3>
            <div class="product-list">
    `;
    
    products.forEach(product => {
        formHTML += `
            <div class="product-item">
                <label>
                    <input type="checkbox" name="product_ids[]" value="${product.product_id}">
                    ${product.product_name} (ID: ${product.product_id})
                </label>
            </div>
        `;
    });
    
    formHTML += `
            </div>
            <div class="button-container">
                <button type="button" id="submit-selected-products" class="btn">View Details</button>
                <button type="button" id="back-button" class="btn back-btn">Back to Main Menu</button>
            </div>
        </form>
    `;
    
    contentDiv.innerHTML = formHTML;
    
    document.getElementById('submit-selected-products').addEventListener('click', function() {
        handleProductSelection(products);
    });
    document.getElementById('back-button').addEventListener('click', loadInitialForm);
}

function handleProductSelection(products) {
    const checkboxes = document.querySelectorAll('input[name="product_ids[]"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedIds.length === 0) {
        alert("Please select at least one product");
        return;
    }
    
    const selectedProducts = products.filter(product => selectedIds.includes(product.product_id));
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    
    const selectedOption = localStorage.getItem('selectedOption');
    
    if (selectedOption === "viewProductInformation") {
        displayInventoryTable(selectedProducts);
    } else if (selectedOption === "updateProduct") {
        loadUpdateProductForm(selectedProducts);
    }
}