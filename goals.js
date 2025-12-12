// goals.js — handles goal creation, persistence, rendering, quick-save
(() => {
  const KEY = "finflow-goals-v1";
  const form = document.getElementById("goalForm");
  const nameInput = document.getElementById("goalName");
  const amountInput = document.getElementById("goalAmount");
  const dateInput = document.getElementById("goalDate");
  const goalsContainer = document.getElementById("goalsContainer");
  const noGoalsEl = document.getElementById("noGoals");

  let goals = JSON.parse(localStorage.getItem(KEY)) || [];

  function save() {
    localStorage.setItem(KEY, JSON.stringify(goals));
  }

  function monthsBetweenNow(targetYearMonth) {
    // targetYearMonth format: YYYY-MM
    const [y, m] = targetYearMonth.split("-").map(Number);
    if (!y || !m) return 0;
    const now = new Date();
    const target = new Date(y, m - 1, 1);
    const years = target.getFullYear() - now.getFullYear();
    const months = years * 12 + (target.getMonth() - now.getMonth());
    return Math.max(1, months); // at least 1 month
  }

  function formatCurrency(n) {
    return "₹" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function calcMonthly(amount, months) {
    if (!months || months <= 0) return amount;
    return Math.ceil(amount / months);
  }

  function addGoal(goal) {
    goals.unshift(goal);
    save();
    render();
  }

  function updateGoal(index, updated) {
    goals[index] = { ...goals[index], ...updated };
    save();
    render();
  }

  function deleteGoal(index) {
    if (!confirm("Delete this goal?")) return;
    goals.splice(index, 1);
    save();
    render();
  }

  function markAchieved(index) {
    goals[index].achieved = true;
    save();
    render();
  }

  function addSavedAmount(index, addAmount) {
    addAmount = Number(addAmount) || 0;
    if (addAmount <= 0) return;
    goals[index].saved = (goals[index].saved || 0) + addAmount;
    // cap saved at target for safety
    if (goals[index].saved > goals[index].amount) goals[index].saved = goals[index].amount;
    save();
    render();
  }

  function render() {
    goalsContainer.innerHTML = "";
    if (!goals || goals.length === 0) {
      noGoalsEl.style.display = "block";
      return;
    }
    noGoalsEl.style.display = "none";

    goals.forEach((g, idx) => {
      const months = monthsBetweenNow(g.targetMonth);
      const monthly = calcMonthly(g.amount - (g.saved || 0), months);
      const saved = g.saved || 0;
      const pct = Math.min(100, Math.round((saved / g.amount) * 100));

      const item = document.createElement("article");
      item.className = "goal-item";
      item.innerHTML = `
        ${g.achieved ? `<div class="achieved">ACHIEVED</div>` : ""}
        <div class="goal-meta">
          <h3 class="goal-title">${escapeHtml(g.name)}</h3>
          <p class="goal-target">Target: ${formatCurrency(g.amount)} • Target month: ${g.targetMonth}</p>

          <div class="goal-row">
            <div class="progress-wrap" aria-hidden="false">
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
              <div class="progress-stats"><span>${pct}%</span><span>${formatCurrency(saved)} / ${formatCurrency(g.amount)}</span></div>
            </div>
          </div>

          <div class="goal-row" style="margin-top:10px">
            <div>Monthly suggestion: <strong>${formatCurrency(monthly)}</strong></div>
          </div>
        </div>

        <div class="goal-controls" aria-hidden="false">
          <div class="saved-row">
            <input aria-label="Add saved amount" type="number" step="1" min="1" placeholder="Add saved (₹)" class="quick-add-input" />
            <button class="btn-ghost btn-small quick-add">Save</button>
          </div>

          <button class="btn-ghost btn-small edit">Edit</button>
          <button class="btn-ghost btn-small delete">Delete</button>
          ${g.achieved ? "" : `<button class="btn-ghost btn-small achieve">Mark Achieved</button>`}
        </div>
      `;

      // wire controls
      const quickAddBtn = item.querySelector(".quick-add");
      const quickAddInput = item.querySelector(".quick-add-input");
      quickAddBtn.addEventListener("click", () => {
        const v = Number(quickAddInput.value);
        if (!v || v <= 0) { quickAddInput.focus(); return; }
        addSavedAmount(idx, v);
      });

      item.querySelector(".delete").addEventListener("click", () => deleteGoal(idx));
      item.querySelector(".edit").addEventListener("click", () => {
        // simple inline-edit: populate form and delete old
        nameInput.value = g.name;
        amountInput.value = g.amount;
        dateInput.value = g.targetMonth;
        deleteGoal(idx);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      const achieveBtn = item.querySelector(".achieve");
      if (achieveBtn) achieveBtn.addEventListener("click", () => markAchieved(idx));

      goalsContainer.appendChild(item);

      // animate progress-fill after appended
      requestAnimationFrame(() => {
        const fill = item.querySelector(".progress-fill");
        if (fill) fill.style.width = pct + "%";
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
  }

  // handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const targetMonth = dateInput.value; // yyyy-mm

    if (!name || !amount || !targetMonth) {
      alert("Please provide name, amount and target month.");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name,
      amount,
      targetMonth,
      saved: 0,
      achieved: false
    };

    addGoal(newGoal);

    // reset form
    nameInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
  });

  // initial render
  render();

})();
