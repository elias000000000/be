// -------------------- Globale Variablen --------------------
let userName = localStorage.getItem("userName") || "";
let payday = localStorage.getItem("payday") || "";
let totalBudget = parseFloat(localStorage.getItem("totalBudget")) || 0;
let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let categories = JSON.parse(localStorage.getItem("categories") || "[]");
let archive = JSON.parse(localStorage.getItem("archive") || "[]");
let selectedTheme = localStorage.getItem("theme") || "standard";

// -------------------- DOM Elemente --------------------
const greetingEl = document.getElementById("greeting");
const monthTextEl = document.getElementById("monthText");
const currentDateEl = document.getElementById("currentDate");
const spentEl = document.getElementById("spent");
const remainingEl = document.getElementById("remaining");
const txCategoryEl = document.getElementById("txCategory");
const historyListEl = document.getElementById("historyList");
const categoriesListEl = document.getElementById("categoriesList");

// Modals
const welcomeModal = document.getElementById("welcomeModal");
const paydayModal = document.getElementById("paydayModal");

// -------------------- Init --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Theme setzen
  setTheme(selectedTheme);

  // Datum setzen
  const now = new Date();
  monthTextEl.textContent = now.toLocaleString("de-DE", { month: "long" });
  currentDateEl.textContent = now.toLocaleDateString("de-DE");

  // Begrüßung
  if (userName) {
    greetingEl.textContent = `Hallo ${userName}`;
  }

  // Budget anzeigen
  updateBudgetUI();

  // Kategorien laden
  renderCategories();
  renderCategorySelect();

  // Transaktionen laden
  renderTransactions();

  // Falls kein Name vorhanden → Modals
  if (!userName) {
    showModal(welcomeModal);
  } else if (!payday) {
    showModal(paydayModal);
  }
});

// -------------------- Theme wechseln --------------------
document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-theme-select");
    setTheme(theme);
    localStorage.setItem("theme", theme);
  });
});

function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  selectedTheme = theme;
}

// -------------------- Name speichern --------------------
document.getElementById("saveName")?.addEventListener("click", () => {
  const nameInput = document.getElementById("userName").value.trim();
  if (nameInput) {
    userName = nameInput;
    localStorage.setItem("userName", nameInput);
    greetingEl.textContent = `Hallo ${nameInput}`;
    closeModal(welcomeModal);
    if (!payday) showModal(paydayModal);
  }
});

// -------------------- Payday speichern --------------------
document.getElementById("savePayday")?.addEventListener("click", () => {
  const day = document.getElementById("paydaySelect").value;
  if (day) {
    payday = day;
    localStorage.setItem("payday", day);
    closeModal(paydayModal);
  }
});

// -------------------- Budget speichern --------------------
document.getElementById("saveBudget")?.addEventListener("click", () => {
  const val = parseFloat(document.getElementById("totalBudget").value);
  if (!isNaN(val) && val > 0) {
    totalBudget = val;
    localStorage.setItem("totalBudget", val.toString());
    updateBudgetUI();
  }
});

function updateBudgetUI() {
  const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
  spentEl.textContent = `CHF ${spent.toFixed(2)}`;
  remainingEl.textContent = `CHF ${(totalBudget - spent).toFixed(2)}`;
}

// -------------------- Kategorien --------------------
document.getElementById("addCategory")?.addEventListener("click", () => {
  const name = document.getElementById("newCategoryName").value.trim();
  if (name && !categories.includes(name)) {
    categories.push(name);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    renderCategorySelect();
    document.getElementById("newCategoryName").value = "";
  }
});

function renderCategories() {
  categoriesListEl.innerHTML = "";
  categories.forEach(cat => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = cat;
    categoriesListEl.appendChild(chip);
  });
}

function renderCategorySelect() {
  txCategoryEl.innerHTML = "";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    txCategoryEl.appendChild(opt);
  });
}

// -------------------- Transaktionen --------------------
document.getElementById("addTx")?.addEventListener("click", () => {
  const category = txCategoryEl.value;
  const desc = document.getElementById("txDesc").value.trim();
  const amount = parseFloat(document.getElementById("txAmount").value);

  if (category && desc && !isNaN(amount) && amount > 0) {
    transactions.push({ category, desc, amount, date: new Date().toISOString() });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateBudgetUI();

    document.getElementById("txDesc").value = "";
    document.getElementById("txAmount").value = "";
  }
});

function renderTransactions() {
  historyListEl.innerHTML = "";
  transactions.forEach(t => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.textContent = `${t.date.slice(0, 10)} | ${t.category} – ${t.desc}: CHF ${t.amount.toFixed(2)}`;
    historyListEl.appendChild(div);
  });
}

// -------------------- Modal Handling --------------------
function showModal(modal) {
  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "flex";
}
function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
}

// -------------------- Menü Handling --------------------
const menuButton = document.getElementById("menuButton");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenu = document.getElementById("closeMenu");

menuButton?.addEventListener("click", () => {
  menuOverlay.setAttribute("aria-hidden", "false");
});
closeMenu?.addEventListener("click", () => {
  menuOverlay.setAttribute("aria-hidden", "true");
});
document.getElementById("menuBackdrop")?.addEventListener("click", () => {
  menuOverlay.setAttribute("aria-hidden", "true");
});
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
    menuOverlay.setAttribute("aria-hidden", "true");
  });
});

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(`tab-${tabId}`).classList.add("active");
}
