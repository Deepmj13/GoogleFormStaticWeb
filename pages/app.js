(() => {
  const PRICES = {
    500: 250,
    1000: 500,
    1500: 750,
    2000: 1000,
  };

  function readPlan() {
    try {
      const raw = localStorage.getItem("formboost_plan");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveRequest(data) {
    localStorage.setItem("formboost_request", JSON.stringify(data));
  }

  function readRequest() {
    try {
      const raw = localStorage.getItem("formboost_request");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function updateRequestSummary(planText, amountText) {
    const planNode = document.getElementById("sumPlan");
    const amountNode = document.getElementById("sumAmount");

    if (planNode) planNode.textContent = planText;
    if (amountNode) amountNode.textContent = amountText;
  }

  function initRequestPage() {
    const form = document.getElementById("request-form");
    if (!form) return;

    const responsesEl = document.getElementById("responses");
    const plan = readPlan();

    if (plan && plan.plan) {
      const numeric = Number.parseInt(plan.plan, 10);
      if (PRICES[numeric]) {
        responsesEl.value = String(numeric);
        updateRequestSummary(`${numeric} Responses`, `INR ${PRICES[numeric]}`);
      }
    }

    responsesEl.addEventListener("change", () => {
      const value = Number(responsesEl.value);
      updateRequestSummary(`${value} Responses`, `INR ${PRICES[value]}`);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const payload = {
        clientName: document.getElementById("clientName").value.trim(),
        contact: document.getElementById("contact").value.trim(),
        formLink: document.getElementById("formLink").value.trim(),
        responses: Number(responsesEl.value),
        audience: document.getElementById("audience").value,
        notes: document.getElementById("notes").value.trim(),
      };

      payload.amount = PRICES[payload.responses] || 0;
      saveRequest(payload);
      window.location.href = "payment.html";
    });
  }

  function renderRequestDetails(requestData) {
    const summary = document.getElementById("requestSummary");
    if (!summary) return;

    if (!requestData) {
      summary.innerHTML = "<p>No request data found. Please submit details first.</p>";
      return;
    }

    const data = [
      ["Name", requestData.clientName || "-"],
      ["Contact", requestData.contact || "-"],
      ["Responses", String(requestData.responses || "-")],
      ["Audience", requestData.audience || "-"],
      ["Amount", `INR ${requestData.amount || 0}`],
    ];

    summary.innerHTML = data
      .map(
        ([label, value]) =>
          `<div><dt>${label}</dt><dd>${value}</dd></div>`
      )
      .join("");
  }

  function initPaymentPage() {
    const form = document.getElementById("payment-form");
    if (!form) return;

    const requestData = readRequest();
    renderRequestDetails(requestData);

    const nameInput = document.getElementById("name");
    const amountInput = document.getElementById("amount");
    const upiIdInput = document.getElementById("upiId");
    const qrImage = document.getElementById("qr");
    const upiText = document.getElementById("upiLink");
    const qrWrapper = document.getElementById("qrWrapper");

    if (requestData?.clientName) nameInput.value = requestData.clientName;
    if (requestData?.amount) amountInput.value = requestData.amount;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const payer = nameInput.value.trim();
      const amount = amountInput.value.trim();
      const upiId = upiIdInput.value.trim();
      const merchant = "FormBoost";

      const link = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchant)}&am=${encodeURIComponent(
        amount
      )}&cu=INR&tn=${encodeURIComponent(`Order for ${payer || "client"}`)}`;

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(link)}`;
      qrImage.src = qrUrl;
      upiText.textContent = link;
      qrWrapper.hidden = false;
    });
  }

  initRequestPage();
  initPaymentPage();
})();
