document.addEventListener("DOMContentLoaded", () => {
  const paymentContainer = document.getElementById("paymentContainer");
  const paymentSuccess = document.getElementById("paymentSuccess");
  const payButton = document.getElementById("payButton");
  const successConfirmBtn = document.getElementById("successConfirmBtn");
  const backBtn = document.getElementById("backBtn");

  const methodInputs = Array.from(document.querySelectorAll("input[name='paymentMethod']"));
  const methodItems = Array.from(document.querySelectorAll(".method_item"));
  const cardForm = document.getElementById("cardForm");
  const transferForm = document.getElementById("transferForm");
  const mobileForm = document.getElementById("mobileForm");

  const cardNumberInput = document.getElementById("cardNumber");
  const cardHolderInput = document.getElementById("cardHolder");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCvvInput = document.getElementById("cardCvv");
  const mobileNumberInput = document.getElementById("mobileNumber");
  const agreeTermsInput = document.getElementById("agreeTerms");

  const totalAmountElement = document.getElementById("totalAmount");
  const supplyAmountElement = document.getElementById("supplyAmount");
  const vatAmountElement = document.getElementById("vatAmount");
  const successAmountElement = document.getElementById("successAmount");

  const airfareAmountElement = document.getElementById("airfareAmount");
  const stayAmountElement = document.getElementById("stayAmount");
  const carAmountElement = document.getElementById("carAmount");

  const formatPrice = (value) => `${value.toLocaleString()}원`;
  const digitsOnly = (value) => value.replace(/\D/g, "");

  const parsedTotal = Number((new URLSearchParams(window.location.search)).get("total"));
  const amounts = {
    airfare: 89000,
    stay: 450000,
    car: 180000,
  };

  const defaultTotal = amounts.airfare + amounts.stay + amounts.car;
  const totalAmount = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : defaultTotal;
  const supplyAmount = Math.round(totalAmount / 1.1);
  const vatAmount = totalAmount - supplyAmount;

  airfareAmountElement.textContent = formatPrice(amounts.airfare);
  stayAmountElement.textContent = formatPrice(amounts.stay);
  carAmountElement.textContent = formatPrice(amounts.car);
  totalAmountElement.textContent = formatPrice(totalAmount);
  supplyAmountElement.textContent = formatPrice(supplyAmount);
  vatAmountElement.textContent = formatPrice(vatAmount);
  successAmountElement.textContent = formatPrice(totalAmount);

  const setMethodForms = (method) => {
    cardForm.classList.toggle("hidden", method !== "card");
    transferForm.classList.toggle("hidden", method !== "transfer");
    mobileForm.classList.toggle("hidden", method !== "mobile");

    methodItems.forEach((item) => {
      const input = item.querySelector("input[name='paymentMethod']");
      item.classList.toggle("is_selected", input && input.value === method);
    });
  };

  methodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      setMethodForms(input.value);
    });
  });

  setMethodForms(methodInputs.find((input) => input.checked)?.value || "card");

  cardNumberInput.addEventListener("input", () => {
    const value = digitsOnly(cardNumberInput.value).slice(0, 16);
    cardNumberInput.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  cardExpiryInput.addEventListener("input", () => {
    const value = digitsOnly(cardExpiryInput.value).slice(0, 4);
    cardExpiryInput.value = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
  });

  cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = digitsOnly(cardCvvInput.value).slice(0, 3);
  });

  mobileNumberInput.addEventListener("input", () => {
    const value = digitsOnly(mobileNumberInput.value).slice(0, 11);
    if (value.length < 4) {
      mobileNumberInput.value = value;
      return;
    }

    if (value.length < 8) {
      mobileNumberInput.value = `${value.slice(0, 3)}-${value.slice(3)}`;
      return;
    }

    mobileNumberInput.value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  });

  const getSelectedMethod = () => methodInputs.find((input) => input.checked)?.value || "card";

  const validatePayment = () => {
    const method = getSelectedMethod();

    if (!agreeTermsInput.checked) {
      alert("결제 약관에 동의해주세요.");
      return false;
    }

    if (method === "card") {
      if (digitsOnly(cardNumberInput.value).length !== 16) {
        alert("카드 번호를 정확히 입력해주세요.");
        cardNumberInput.focus();
        return false;
      }

      if (!cardHolderInput.value.trim()) {
        alert("카드 소유자명을 입력해주세요.");
        cardHolderInput.focus();
        return false;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardExpiryInput.value)) {
        alert("유효기간을 MM/YY 형식으로 입력해주세요.");
        cardExpiryInput.focus();
        return false;
      }

      if (digitsOnly(cardCvvInput.value).length !== 3) {
        alert("CVV 3자리를 입력해주세요.");
        cardCvvInput.focus();
        return false;
      }
    }

    if (method === "mobile" && digitsOnly(mobileNumberInput.value).length < 10) {
      alert("휴대폰 번호를 정확히 입력해주세요.");
      mobileNumberInput.focus();
      return false;
    }

    return true;
  };

  payButton.addEventListener("click", () => {
    if (!validatePayment()) return;

    payButton.disabled = true;
    const originalText = payButton.textContent;
    payButton.textContent = "결제 처리 중...";

    window.setTimeout(() => {
      payButton.disabled = false;
      payButton.textContent = originalText;

      paymentContainer.classList.add("hidden");
      paymentSuccess.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  });

  successConfirmBtn.addEventListener("click", () => {
    window.location.href = "sub/my_page.html";
  });

  backBtn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "sub/Availability.html";
  });
});
