let inventory = JSON.parse(localStorage.getItem("sscInventory")) || [];

function saveData() {
  localStorage.setItem("sscInventory", JSON.stringify(inventory));
}

function getStatus(item) {
  if (item.stock === 0) return "low";
  if (item.stock < item.standardQty) return "low";
  if (item.stock < item.standardQty * 3) return "warning";
  return "ok";
}

function renderTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  let totalValue = 0;
  let lowStock = 0;

  inventory.forEach(item => {
    totalValue += item.stock * item.unitPrice;
    if (item.stock < item.standardQty) lowStock++;

    const row = document.createElement("tr");
    row.className = getStatus(item);

    row.innerHTML = `
      <td>${item.description}</td>
      <td>${item.company}</td>
      <td>${item.partNumber}</td>
      <td>${item.standardQty}</td>
      <td contenteditable onblur="updateStock(${item.id}, this.innerText)">
        ${item.stock}
      </td>
      <td>${getStatus(item).toUpperCase()}</td>
      <td>$${item.unitPrice}</td>
    `;

    table.appendChild(row);
  });

  document.getElementById("totalParts").innerText = inventory.length;
  document.getElementById("lowStock").innerText = lowStock;
  document.getElementById("inventoryValue").innerText = totalValue.toFixed(2);
}

function updateStock(id, value) {
  const item = inventory.find(i => i.id === id);
  item.stock = parseInt(value) || 0;
  saveData();
  renderTable();
}

renderTable();