// Storage wrapper class, handles local storage and event notifications
class TransactionStore {
  transactions = [];
  updateHandlers = [];

  constructor() {
    const localStorageTransactions = JSON.parse(
      localStorage.getItem("transactions")
    );
    this.transactions = localStorageTransactions || [];
    console.log(this.transactions);
  }

  add(tx) {
    console.log(this);
    this.transactions.push(tx);
    this.notify();
    this.updateStorage();
  }

  remove(tx) {
    const index = this.transactions.indexOf(tx);
    if (index > -1) {
      this.transactions.splice(index, 1);
    }
    this.notify();
    this.updateStorage();
  }

  updateStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  notify() {
    this.updateHandlers.forEach((h) => h.call(null, this));
  }

  onUpdate(fn) {
    this.updateHandlers.push(fn);
  }
}

// View class, renders and updates components, handles UI events and updates to store
// Just one big monolith for now, could be broken down into sub-components
class ExpenseTrackerView {
  balance = document.getElementById("balance");
  moneyPlus = document.getElementById("money-plus");
  moneyMinus = document.getElementById("money-minus");
  list = document.getElementById("list");
  form = document.getElementById("form");
  text = document.getElementById("text");
  amount = document.getElementById("amount");
  store = null;

  constructor(store) {
    this.form.addEventListener("submit", (e) => this.addTransaction(e));
    this.store = store;
    this.store.onUpdate((s) => this.update(s));
    this.update(store);
  }

  // Update view - add transactions to DOM and update amounts
  update(store) {
    this.list.innerHTML = "";
    store.transactions.forEach((t) => this.addTransactionToDOM(t));
    this.updateValues(store.transactions);
  }

  // Add transactions to DOM
  addTransactionToDOM(tx) {
    // Get sign
    const sign = tx.amount < 0 ? "-" : "+";
    const clz = tx.amount < 0 ? "minus" : "plus";

    const item = document.createElement("li");
    item.classList.add(clz);

    item.innerHTML = `
      ${tx.text}
      <span> ${sign}$${Math.abs(tx.amount)} </span>
      <button class="delete-btn">x</button>
    `;

    item
      .querySelector(".delete-btn")
      .addEventListener("click", () => this.removeTransaction(tx));

    this.list.appendChild(item);
  }

  // Form submit handler, adds transactions to store
  addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
      alert("Please enter a text and amount");
      return;
    }

    const tx = {
      id: randomId(),
      text: text.value,
      amount: +amount.value,
    };

    this.store.add(tx);

    text.value = "";
    amount.value = "";
  }

  // Delete button click handler, deletes transactions from store
  removeTransaction(tx) {
    store.remove(tx);
  }

  // Updates values displayed in amounts panel when store changes
  updateValues(transactions) {
    const amounts = transactions.map((t) => t.amount);

    // helper functions
    const sum = (acc, item) => acc + item;
    const gte = (v) => (item) => item >= v;
    const lt = (v) => (item) => item < v;

    const total = amounts.reduce(sum, 0);
    const income = amounts.filter(gte(0)).reduce(sum, 0);
    const expense = amounts.filter(lt(0)).reduce(sum, 0);

    this.balance.innerHTML = `$${total.toFixed(2)}`;
    this.moneyPlus.innerHTML = `$${income.toFixed(2)}`;
    this.moneyMinus.innerHTML = `$${Math.abs(expense).toFixed(2)}`;
  }
}

function randomId() {
  return Math.floor(Math.random() * 10000000);
}

const store = new TransactionStore();
const view = new ExpenseTrackerView(store);
