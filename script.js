// Example: XP animation
document.addEventListener("DOMContentLoaded", () => {
    const xp = document.querySelector(".progress");
    if (xp) {
        xp.style.transition = "width 1.5s ease";
    }
});
// Inputs
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const addBtn = document.getElementById("add-expense-btn");

// Load saved expenses
let expenses = JSON.parse(localStorage.getItem("finflow-expenses")) || [];

// Add expense (hidden, no display)
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const amount = amountInput.value.trim();

  if (!name || !amount) {
    alert("Please enter both name and amount.");
    return;
  }

  const newExpense = {
    name,
    amount: Number(amount),
    time: Date.now()
  };

  // Store internally
  expenses.push(newExpense);
  localStorage.setItem("finflow-expenses", JSON.stringify(expenses));

  // Clear input
  nameInput.value = "";
  amountInput.value = "";

  // Nothing is shown on screen
  alert("Expense added successfully!");
});
