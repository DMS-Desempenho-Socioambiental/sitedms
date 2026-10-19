export function initIfcCards() {
  const cards = Array.from(document.querySelectorAll(".pd-flip"));
  if (!cards.length) return;

  function toggle(card) {
    const isFlipped = !card.classList.contains("is-flipped");
    card.classList.toggle("is-flipped", isFlipped);
    card.classList.toggle("is-unflipped", !isFlipped);
    card.setAttribute("aria-pressed", String(isFlipped));
  }

  function release(card) {
    card.classList.remove("is-unflipped");
  }

  cards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", () => toggle(card));
    card.addEventListener("mouseleave", () => release(card));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle(card);
        return;
      }
      if (event.key === "Escape" && card.classList.contains("is-flipped")) toggle(card);
    });
  });
}
