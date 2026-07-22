(function () {
  function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "sheet-editor-toolbar";

    toolbar.innerHTML = `
      <button type="button" id="toggle-edit-mode">
        Activer le mode édition
      </button>
      <button type="button" id="toggle-tooltip-mode" disabled>
        Ajouter une info-bulle
      </button>
      <button type="button" id="export-config">
        Exporter la configuration
      </button>
    `;

    return toolbar;
  }

  function insertToolbar() {
    const existing = document.querySelector(".sheet-editor-toolbar");
    if (existing) {
      return existing;
    }

    const sheet = document.querySelector(".character-sheet");
    const header = document.querySelector(".character-header");

    if (!sheet || !header) {
      return null;
    }

    const toolbar = createToolbar();
    header.insertAdjacentElement("afterend", toolbar);
    return toolbar;
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, {
        once: true
      });
    } else {
      callback();
    }
  }

  onReady(insertToolbar);
})();
