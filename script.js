const financeShares = {
  mortgage: 0.8,
  bank: 0.15,
  savings: 0.05
};

const currency = new Intl.NumberFormat("da-DK", {
  maximumFractionDigits: 0
});

function parseMoney(value) {
  return Number(String(value).replace(/[^\d]/g, ""));
}

function formatMoney(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return currency.format(Math.round(value));
}

function monthlyPayment(principal, yearlyRate, years) {
  const months = years * 12;
  const monthlyRate = yearlyRate / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function setStatus(calculator, text) {
  const status = calculator.querySelector("[data-calculator-status]");
  if (status) {
    status.textContent = text;
  }
}

function updateMonthlyEstimate(price, mortgage, bank) {
  const monthlyElement = document.getElementById("monthlyValue");
  if (!monthlyElement) {
    return;
  }

  if (!price) {
    monthlyElement.textContent = "0 kr.";
    return;
  }

  const monthlyEstimate = monthlyPayment(mortgage, 0.04, 30) + monthlyPayment(bank, 0.07, 10);
  monthlyElement.textContent = `${formatMoney(Math.round(monthlyEstimate / 100) * 100)} kr.`;
}

function setFieldValue(field, value) {
  if (field) {
    field.value = formatMoney(value);
  }
}

function setAutoValue(field, value, editedInput) {
  if (!field || field === editedInput) {
    return;
  }

  field.value = formatMoney(value);
}

function resetCalculator(calculator) {
  calculator.querySelectorAll("[data-finance-input], [data-finance-output]").forEach((field) => {
    field.value = "";
    field.dataset.manual = "false";
    field.closest(".input-card, .output-card")?.classList.remove("is-active", "is-locked");
  });

  setStatus(calculator, "Skriv ejendomspris, udbetaling eller begge dele.");
  updateMonthlyEstimate(0, 0, 0);
}

function calculateFromKnownValues(calculator, editedInput) {
  const priceInput = calculator.querySelector('[data-finance-input="price"]');
  const savingsInput = calculator.querySelector('[data-finance-input="savings"]');
  const mortgageOutput = calculator.querySelector('[data-finance-output="mortgage"]');
  const bankOutput = calculator.querySelector('[data-finance-output="bank"]');

  const editedValue = parseMoney(editedInput.value);
  const isEditingEmptyField = editedInput.value.trim() === "";
  editedInput.dataset.manual = editedValue > 0 ? "true" : "false";

  const hasManualPrice = priceInput.dataset.manual === "true";
  const hasManualSavings = savingsInput.dataset.manual === "true";
  const manualPrice = parseMoney(priceInput.value);
  const manualSavings = parseMoney(savingsInput.value);

  if (!hasManualPrice && !hasManualSavings) {
    resetCalculator(calculator);
    return;
  }

  let price = 0;
  let savings = 0;
  let mortgage = 0;
  let bank = 0;
  let statusText = "";

  if (hasManualPrice && hasManualSavings) {
    // Case 1: Brugeren kender både ejendomspris og udbetaling.
    // Realkredit må højst være 80% af prisen, og banklånet bliver resten.
    price = manualPrice;
    savings = manualSavings;
    mortgage = Math.min(price * financeShares.mortgage, Math.max(price - savings, 0));
    bank = Math.max(price - mortgage - savings, 0);
    statusText = "Beregner ud fra både ejendomspris og udbetaling.";

    if (savings < price * financeShares.savings) {
      statusText = "Udbetalingen er under 5%, så banklånet bliver større end standardmodellen.";
    } else if (savings > price * 0.2) {
      statusText = "Udbetalingen er over 20%, så banklånet bliver 0 kr. i denne model.";
    }
  } else if (hasManualPrice) {
    // Case 2: Brugeren kender kun ejendomsprisen.
    // Siden bruger standardfordelingen 80% / 15% / 5%.
    price = manualPrice;
    mortgage = price * financeShares.mortgage;
    bank = price * financeShares.bank;
    savings = price * financeShares.savings;
    statusText = "Beregner standardfordeling ud fra ejendomspris.";
  } else {
    // Case 3: Brugeren kender kun udbetalingen.
    // Udbetalingen er 5%, så den mulige ejendomspris findes ved at dividere med 0,05.
    savings = manualSavings;
    price = savings / financeShares.savings;
    mortgage = price * financeShares.mortgage;
    bank = price * financeShares.bank;
    statusText = "Beregner mulig ejendomspris ud fra udbetaling.";
  }

  // Det felt brugeren aktivt skriver i, bliver ikke auto-udfyldt her.
  // Det gør, at man kan slette hele feltet og skrive en ny værdi uden at tallet hopper tilbage.
  setAutoValue(priceInput, price, editedInput);
  setAutoValue(savingsInput, savings, editedInput);
  setFieldValue(mortgageOutput, mortgage);
  setFieldValue(bankOutput, bank);

  calculator.querySelectorAll(".input-card").forEach((card) => card.classList.remove("is-active"));
  calculator.querySelectorAll(".output-card").forEach((card) => card.classList.add("is-locked"));
  calculator.querySelectorAll('[data-finance-input][data-manual="true"]').forEach((field) => {
    field.closest(".input-card")?.classList.add("is-active");
  });

  setStatus(calculator, statusText);
  updateMonthlyEstimate(price, mortgage, bank);

  if (isEditingEmptyField) {
    editedInput.value = "";
  }
}

document.querySelectorAll("[data-calculator]").forEach((calculator) => {
  const resetButton = calculator.querySelector("[data-calculator-reset]");

  calculator.querySelectorAll("[data-finance-input]").forEach((input) => {
    input.dataset.manual = "false";
    input.addEventListener("input", () => calculateFromKnownValues(calculator, input));
  });

  resetButton?.addEventListener("click", () => resetCalculator(calculator));
});
