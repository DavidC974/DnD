(function () {
  const editorHtml = `
    <div class="field-editor" id="field-editor" hidden>
      <h2 id="field-editor-title">Ajouter un texte</h2>

      <label>
        Identifiant
        <input type="text" id="field-id">
      </label>

      <label>
        Valeur
        <input type="text" id="field-value">
      </label>

      <label>
        Taille
        <input type="number" id="field-size" value="2" min="0.1" step="0.1">
      </label>

      <div class="field-editor-coordinates">
        <span id="field-x-display">x : 0</span>
        <span id="field-y-display">y : 0</span>
      </div>

      <div class="field-editor-buttons">
        <button type="button" id="save-field">Ajouter</button>
        <button type="button" id="delete-field" hidden>Supprimer</button>
        <button type="button" id="cancel-field">Annuler</button>
      </div>
    </div>

    <div class="field-editor" id="tooltip-editor" hidden>
      <h2 id="tooltip-editor-title">Ajouter une info-bulle</h2>

      <label>
        Identifiant
        <input type="text" id="tooltip-id">
      </label>

      <label>
        Titre
        <input type="text" id="tooltip-title">
      </label>

      <label>
        Texte
        <textarea id="tooltip-text" rows="5"></textarea>
      </label>

      <label>
        Largeur de la zone (%)
        <input type="number" id="tooltip-width" value="6" min="0.5" max="100" step="0.5">
      </label>

      <label>
        Hauteur de la zone (%)
        <input type="number" id="tooltip-height" value="6" min="0.5" max="100" step="0.5">
      </label>

      <div class="field-editor-coordinates">
        <span id="tooltip-x-display">x : 0</span>
        <span id="tooltip-y-display">y : 0</span>
      </div>

      <div class="field-editor-buttons">
        <button type="button" id="save-tooltip">Ajouter</button>
        <button type="button" id="delete-tooltip" hidden>Supprimer</button>
        <button type="button" id="cancel-tooltip">Annuler</button>
      </div>
    </div>
  `;

  function insertEditors() {
    const existing = document.querySelector("#field-editor");
    if (existing) {
      return;
    }

    const container = document.querySelector("main.page-shell");
    if (!container) {
      return;
    }

    container.insertAdjacentHTML("beforeend", editorHtml);
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  onReady(insertEditors);
})();
