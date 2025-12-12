// Monthly Spending Bar Chart
const barCtx = document.getElementById("monthlyBar");
new Chart(barCtx, {
    type: "bar",
    data: {
        labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Amount Spent (₹)",
            data: [12000, 9000, 15000, 11000, 13000],
            borderWidth: 1
        }]
    }
});

// Category Pie Chart
const pieCtx = document.getElementById("spendPie");
new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: ["Food", "Shopping", "Travel", "Bills", "Entertainment"],
        datasets: [{
            data: [25, 20, 15, 30, 10]
        }]
    }
});

// XP Progress Line Chart
const xpCtx = document.getElementById("xpLine");
new Chart(xpCtx, {
    type: "line",
    data: {
        labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "XP Gained",
            data: [120, 140, 200, 250, 300],
            tension: 0.4,
            borderWidth: 2
        }]
    }
});

// Savings Goal Achievements
const saveCtx = document.getElementById("savingsLine");
new Chart(saveCtx, {
    type: "line",
    data: {
        labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Savings Achieved (₹)",
            data: [3000, 4500, 5000, 7000, 6500],
            tension: 0.4,
            borderWidth: 2
        }]
    }
});
