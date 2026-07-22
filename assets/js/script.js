document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("[data-page-title]");
  if (title) {
    document.title = title.textContent.trim();
  }
});
