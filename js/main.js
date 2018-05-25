window.onload = () => {
    if (typeof Storage === "undefined") {
        alert("No Web Storage support. App won't function properly.")
    }
  
    hideItemList();
}

/*
 * Global DOM objects
 */
const weightLimitElement = document.getElementById("weight-limit");
const itemNameElement = document.getElementById("item-name");
const itemWorthElement = document.getElementById("item-worth");
const itemWeightElement = document.getElementById("item-weight");
const showItemsBtn = document.getElementById("show-items-btn");
const hideItemsBtn = document.getElementById("hide-items-btn");
const removeAllItemsBtn = document.getElementById("remove-all-items-btn");
const itemListElement = document.getElementById("item-list");
const recommendationElement = document.getElementById("recommendation");

/*
 * Data functions
 */
function addItem() {
    const itemName = itemNameElement.value.trim();
    const itemWorth = parseInt(itemWorthElement.value);
    const itemWeight = parseInt(itemWeightElement.value);
    const item = validateItemProps(itemName, itemWorth, itemWeight);
    
    if (item !== null) {
        const items = getItems();
        items.push(item);
        try {
            localStorage.setItem("items", JSON.stringify(items));
            updateItemList();
            clearInput();
        } catch (err) {
            console.log(err);
            alert("Web Storage full!");
        }
    }
}

function getItems() {
    const items = localStorage.getItem("items");
    if (items === null) return [];
    return JSON.parse(items);
}

function removeItem(index) {
    const items = getItems();
    if (index > -1) items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    updateItemList();
}

function removeAllItems() {
    localStorage.removeItem("items");
    updateItemList();
}

function getWeightLimit() {
    const weightLimit = parseInt(weightLimitElement.value);
    if (isNaN(weightLimit) || weightLimit < 0) return 0;
    else return weightLimit*1000;
}

function validateItemProps(itemName, itemWorth, itemWeight) {
    if (itemName === "" ||
        isNaN(itemWorth) || itemWorth <= 0 || itemWorth > 40 ||
        isNaN(itemWeight) || itemWeight <= 0) return null;
    return {
        name: itemName,
        worth: itemWorth,
        weight: itemWeight
    };
}

/*
 * View functions
 */
function showItemList() {
    // Hide these
    showItemsBtn.style.display = "none";
    
    // Show these
    hideItemsBtn.style.display = "inline-block";
    removeAllItemsBtn.style.display = "block";
    itemListElement.style.display = "block";
    updateItemList();
}

function hideItemList() {
    // Hide these
    hideItemsBtn.style.display = "none";
    removeAllItemsBtn.style.display = "none";
    itemListElement.style.display = "none";
    
    // Show these
    showItemsBtn.style.display = "inline-block";
    showItemsBtn.innerHTML = `Show items (${getItems().length})`;
}

function updateItemList() {
    const items = getItems();
    let itemIndex = 0;
    let itemListView = "";
    items.forEach(item => {
        const itemView = `<div class="item">
                    ${item.name} (${item.weight}g), worth ${item.worth}
                    <span class="remove">
                    <a href="#item-list" onclick="removeItem(${itemIndex})">
                    Remove
                    </a>
                    </span>
                    </div>`;
        itemListView = itemView + itemListView;
        itemIndex++;
    });
    itemListElement.innerHTML = itemListView;
}

function showRecommendation(weightLimit, bagItems) {
    let recommendationView = `<p style="font-size: 70%">
                            With ${weightLimit/1000}kg weight limit, 
                            you can pack:
                            </p>
                            <div class="item-list">`;
    let remainingAvailableWeight = weightLimit;
    
    bagItems.forEach(item => {
        recommendationView += `<div class="item">${item.name}</div>`;
        remainingAvailableWeight -= item.weight;
    });
    recommendationView += "</div>";
    
    recommendationElement.innerHTML = recommendationView;
}

function clearInput() {
    itemNameElement.value = "";
    itemWorthElement.value = "";
    itemWeightElement.value = "";
    showItemsBtn.innerHTML = `Show items (${getItems().length})`;
}

/*
 * Control functions
 */
function getHelp() {
    const weightLimit = getWeightLimit();
    const items = getItems();
    
    items.sort((a, b) => b.worth - a.worth);

    const bagItems = fillInBag(weightLimit, items);

    if (bagItems.length > 0) showRecommendation(weightLimit, bagItems);
}

function fillInBag(weightLimit, items) {
    const bagItems = [];
    let bagWeight = 0, bagItemCount = 0;
    for (let i = 0; i < items.length; i++) {
        if (bagWeight + items[i].weight <= weightLimit) {
            bagItems[bagItemCount++] = items[i];
            bagWeight += items[i].weight;
        }
    }
    return bagItems;
}