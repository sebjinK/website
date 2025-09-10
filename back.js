import "@fontsource/golos-text"; // Imports default weight (400)
// Or specify weight and style:
import "@fontsource/golos-text/400.css";
import "@fontsource/golos-text/700-italic.css";


document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("abouttitle");
  const panel   = document.getElementById("aboutpara");

  function expand() {
    panel.classList.add("show");
    panel.style.maxHeight = panel.scrollHeight + "px"; // animate to content height
    panel.style.padding = "1rem";
    trigger.setAttribute("aria-expanded", "true");
  }

  function collapse() {
    // set explicit height first so transition animates upward
    panel.style.maxHeight = panel.scrollHeight + "px";
    // force a reflow so the browser registers the starting height
    panel.offsetHeight; 
    panel.style.maxHeight = "0px";
    panel.style.padding = "0 1rem";
    trigger.setAttribute("aria-expanded", "false");

    // after transition ends, remove .show for clean state
    const onEnd = (e) => {
      if (e.propertyName === "max-height") {
        panel.classList.remove("show");
        panel.removeEventListener("transitionend", onEnd);
      }
    };
    panel.addEventListener("transitionend", onEnd);
  }

  function toggle() {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    if (expanded) collapse(); else expand();
  }

  // click + keyboard (Enter/Space) support
  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  // optional: respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    panel.style.transition = "none";
  }
});