(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));

  const links = document.querySelectorAll("[data-plan]");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const selectedPlan = link.getAttribute("data-plan");
      const selectedPrice = link.getAttribute("data-price");

      localStorage.setItem(
        "formboost_plan",
        JSON.stringify({
          plan: selectedPlan,
          price: selectedPrice,
        })
      );
    });
  });
})();
