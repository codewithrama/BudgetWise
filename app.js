"use strict";

//Setting Dom values
const selectedCurrency = document.querySelector("#currency");
const currencysymbol = document.querySelectorAll(".symbol");
const typeOfTransaction = document.querySelector("#type");
const transactionDescription = document.querySelector("#desc");
const transcationAmount = document.querySelector("#amount");
const addTranscationAmonut = document.querySelector(".btn-add");
const container = document.querySelector(".transaction--row--container");
const totalIncome = document.querySelector(".incomevalue");
const totalExpense = document.querySelector(".expensevalue");
const totalbalance = document.querySelector(".balancevalue");
const clearall = document.querySelector(".clear-all");
//creating variables
let type;
let transactionsarr = [];
let incometotal = 0;
let balancetotal = 0;
let expensetotal = 0;
let curr = "";
let budgetincome = 0;
//array

//hiding expense initially

if (budgetincome === 0) {
  document.querySelector(".hide").disabled = true;
}

//Getting Currency Value and setting dynamically in ui
selectedCurrency.addEventListener("change", function () {
  const [currency, currencySign] = selectedCurrency.value.split(",");
  console.log(currencySign);
  for (let sym of currencysymbol) {
    sym.textContent = currencySign;
    curr = sym.innerText;
    console.log(curr);
  }
  badgeDisplay(transactionsarr);
});

//Getting Type of Transaction
typeOfTransaction.addEventListener("change", function () {
  type = typeOfTransaction.value;
  console.log("Inside change:", type); // works here
});

//renderTransactionlist

const renderTransactionlist = function (transactionsarr) {
  container.innerHTML = "";
  for (let i = 0; i < transactionsarr.length; i++) {
    const html = `
  <div class="transaction-item">
    <div class="transaction-left">
      <span class="icon">
        ${transactionsarr[i].type === "income" ? "💰" : "💸"}
      </span>
      <div class="transaction-text">
        <div class="description">
          ${transactionsarr[i].tDescription}
        </div>
        <div class="date">
          ${transactionsarr[i].tdate}
        </div>
      </div>
    </div>

    <div class="transaction-right">
      <span class="${transactionsarr[i].type}--amount">
        ${transactionsarr[i].tAmount}
      </span>
      <button class="delete" data-id="${transactionsarr[i].id}">Delete</button>
    </div>
  </div>
`;

    container.insertAdjacentHTML("afterbegin", html);
  }
};

// Total income, Expenses, Balance

const badgeDisplay = function (transactionsarr) {
  transactionsarr.forEach(function (tarr, index) {
    const [sign, value] = transactionsarr[index].tAmount;
    console.log(sign, typeof sign);
    if (sign === "+") {
      incometotal = incometotal + Number(transactionsarr[index].tAmount);
    } else {
      expensetotal = expensetotal + Number(transactionsarr[index].tAmount);
    }
  });
  totalIncome.textContent = `${curr} ${incometotal}`;
  totalExpense.textContent = `${curr} ${expensetotal}`;
  totalbalance.textContent = `${curr} ${Number(
    incometotal - Math.abs(expensetotal)
  )}`;

  budgetincome = incometotal;

  incometotal = 0;
  expensetotal = 0;
};

// Add Transaction

addTranscationAmonut.addEventListener("click", function () {
  if (
    transactionDescription.value !== "" &&
    transcationAmount.value !== "" &&
    typeOfTransaction.value !== ""
  ) {
    if (selectedCurrency.value !== "") {
      const currentDate = new Date()
        .toLocaleDateString("en-GB")
        .replaceAll(" ", "/ ");
      const transaction = {
        id: Date.now(),
        tDescription: transactionDescription.value,
        type: type,
        tAmount: `${type === "income" ? "+" : "-"}` + transcationAmount.value,
        tdate: currentDate,
      };

      transactionsarr.push(transaction);
      renderTransactionlist(transactionsarr);
      badgeDisplay(transactionsarr);

      transactionDescription.value = "";
      transcationAmount.value = "";
      typeOfTransaction.value = "";
      document.querySelector(".hide").disabled = false;
    } else {
      alert("Please Select Currency ");
    }
  } else {
    alert("Please enter Transaction Details");
  }
});

//clear all functionality

clearall.addEventListener("click", function () {
  transactionsarr = [];
  container.innerHTML = "";
  document.querySelector(".hide").disabled = true;
  badgeDisplay(transactionsarr);
  selectedCurrency.value = "";
});

//delete icon functionality

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    const idToDelete = Number(e.target.dataset.id);
    transactionsarr = transactionsarr.filter(
      (trans) => trans.id !== idToDelete
    );
    renderTransactionlist(transactionsarr);
    badgeDisplay(transactionsarr);

    if (transactionsarr.length === 0) {
      document.querySelector(".hide").disabled = true;
    }
  }
});
