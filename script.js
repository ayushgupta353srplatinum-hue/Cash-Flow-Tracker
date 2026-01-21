let salary = 0;
let expenses = [];
let chart;

const salaryInput = document.getElementById("salaryInput");
const salaryDisplay = document.getElementById("salaryDisplay");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const balanceEl = document.getElementById("balance");

/* Load Data */
window.onload = function () {
  salary = Number(localStorage.getItem("salary")) || 0;
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  salaryDisplay.innerText = salary;
  renderExpenses();
  updateBalance();
  drawChart();
};
/* Save Salary */
document.getElementById("saveSalary").addEventListener("click", () => {
  if (salaryInput.value <= 0) return alert("Enter valid salary");
  salary = Number(salaryInput.value);
  localStorage.setItem("salary", salary);
  salaryDisplay.innerText = salary;
  updateBalance();
  drawChart();
});
/* Add Expense */
document.getElementById("addExpense").addEventListener("click", () => {
  if (expenseName.value === "" || expenseAmount.value <= 0) {
    alert("Invalid expense");
    return;
  }

  expenses.push({
    name: expenseName.value,
    amount: Number(expenseAmount.value)
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  expenseName.value = "";
  expenseAmount.value = "";

  renderExpenses();
  updateBalance();
  drawChart();
});

/* Render Expense List */
function renderExpenses() {
  expenseList.innerHTML = "";
  expenses.forEach((exp, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.name} - ₹${exp.amount}
      <span class="delete" onclick="deleteExpense(${index})">🗑</span>
    `;
    expenseList.appendChild(li);
  });
}

/* Delete Expense */
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateBalance();
  drawChart();
}

/* Balance */
function updateBalance() {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  balanceEl.innerText = salary - totalExpense;
}

/* Chart */
function drawChart() {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = salary - totalExpense;

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data: {
      labels: ["Expenses", "Remaining"],
      datasets: [{
        data: [totalExpense, remaining],
        backgroundColor: ["#ef4444", "#22c55e"]
      }]
    }
  });
}
