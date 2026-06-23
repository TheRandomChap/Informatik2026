const slider = document.getElementById("priceSlider");

const currency = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  maximumFractionDigits: 0
});

function formatKr(value) {
  return currency.format(value).replace("DKK", "kr.");
}

function monthlyPayment(principal, yearlyRate, years) {
  const months = years * 12;
  const monthlyRate = yearlyRate / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function updateCalculator() {
  if (!slider) {
    return;
  }

  const price = Number(slider.value);
  const mortgage = price * 0.8;
  const bankLoan = price * 0.15;
  const downPayment = price * 0.05;
  const monthlyEstimate = monthlyPayment(mortgage, 0.04, 30) + monthlyPayment(bankLoan, 0.07, 10);

  setText("priceValue", formatKr(price));
  setText("mortgageValue", formatKr(mortgage));
  setText("bankLoanValue", formatKr(bankLoan));
  setText("downPaymentValue", formatKr(downPayment));
  setText("monthlyValue", formatKr(Math.round(monthlyEstimate / 100) * 100));
}

if (slider) {
  slider.addEventListener("input", updateCalculator);
  updateCalculator();
}
