window.onload = function () {
  if (typeof(Storage) === "undefined") {
    alert("No web storage support. App won't function properly.")
  }
  
  hideItemList();
}

/*
 * Item functionality
 */

function addItem() {
  var itemName = document.getElementById("item-name").value;
  var itemWorth = document.getElementById("item-worth").value;
  var itemWeight = document.getElementById("item-weight").value;
  var item = validateItemProps(itemName, itemWorth, itemWeight);
  
  if (item !== null) {
    var items = getItems();
    items[items.length] = item;
    try {
      localStorage.setItem("items", JSON.stringify(items));
      updateItemList();
      clearInput();
    } catch (e) {
      console.log(e);
      alert("LocalStorage full!");
    }
  }
}

function validateItemProps(itemName, itemWorth, itemWeight) {
  if (itemName.trim() === "" ||
      itemWorth.trim() === "" || itemWorth <= 0 || itemWorth > 40 ||
      itemWeight.trim() === "" || itemWeight <= 0) return null;
  return {
    name: itemName,
    worth: parseInt(itemWorth.trim()),
    weight: parseInt(itemWeight.trim())
  };
}

function getItems() {
  var items = localStorage.getItem("items");
  if (items === null) return [];
  return JSON.parse(items);
}

function removeItem(index) {
  var items = getItems();
  if (index > -1) items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  updateItemList();
}

function removeAllItems() {
  localStorage.removeItem("items");
  updateItemList();
}

/*
 * Item view functionality
 */

function showItemList() {
  // Hide these
  document.getElementById("show-items-btn").style = "display: none";
  
  // Show these
  document.getElementById("hide-items-btn").style = "display: inline-block";
  document.getElementById("remove-all-items-btn").style = "display: block";
  document.getElementById("item-list").style = "display: block";
  updateItemList();
}

function hideItemList() {
  // Hide these
  document.getElementById("hide-items-btn").style = "display: none";
  document.getElementById("remove-all-items-btn").style = "display: none";
  document.getElementById("item-list").style = "display: none";
  
  // Show these
  document.getElementById("show-items-btn").style = "display: inline-block";
  document.getElementById("show-items-btn").innerHTML = "Show items ("
                                                      + getItems().length + ")";
}

function updateItemList() {
  var itemListView = "";
  var items = getItems();
  var index = 0;
  items.forEach(function (item) {
    var itemView = "<div class=\"item\">"
                 + item.name + " (" + item.weight + "g), "
                 + "worth " + item.worth
                 + "<span class=\"remove\">"
                 + "<a href=\"#item-list\" "
                 + "onclick=\"removeItem(" + index + ")\">Remove</a>"
                 + "</span>"
                 + "</div>";
    itemListView = itemView + itemListView;
    index++;
  });
  document.getElementById("item-list").innerHTML = itemListView;
}

function clearInput() {
  var itemName = document.getElementById("item-name").value = "";
  var itemWorth = document.getElementById("item-worth").value = "";
  var itemWeight = document.getElementById("item-weight").value = "";
  document.getElementById("show-items-btn").innerHTML = "Show items ("
                                                      + getItems().length + ")";
}

/*
 * Get help functionality
 */

function getHelp() {
  var weightLimit = getWeightLimit();
  var items = getItems();
  
  items.sort(function (a, b) {
    return b.worth - a.worth;
  });

  var bagItems = fillInBag(weightLimit, items);

  if (bagItems.length > 0) showRecommendation(weightLimit, bagItems);
}

function getWeightLimit() {
  var weightLimit = document.getElementById("weight-limit").value;
  if (weightLimit.trim() === "" || weightLimit < 0) return 0;
  else return weightLimit*1000;
}

function fillInBag(weightLimit, items) {
  var bagItems = [];
  var bagWeight = 0, bagItemCount = 0;
  for (var i=0; i<items.length; i++) {
    if (bagWeight + items[i].weight <= weightLimit) {
      bagItems[bagItemCount++] = items[i];
      bagWeight += items[i].weight;
    }
  }
  return bagItems;
}

function showRecommendation(weightLimit, bagItems) {
  var recommendation = "<p style=\"font-size: 70%\">"
                     + "With " + weightLimit/1000 + "kg weight limit, "
                     + "you can pack:</p>"
                     + "<div class=\"item-list\">";
  var remainingAvailableWeight = weightLimit;
  
  bagItems.forEach(function (item) {
    recommendation += "<div class=\"item\">"
                    + item.name
                    + "</div>";
    remainingAvailableWeight -= item.weight;
  });
  recommendation += "</div>";
  
  document.getElementById("recommendation").innerHTML = recommendation;
}