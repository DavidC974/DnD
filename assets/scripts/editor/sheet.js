const {
  createFieldElement,
  renderFields,
  updateFieldElement
} = window.CharacterSheetFields || {};

const {
  createTooltipElement,
  renderTooltips,
  updateTooltipElement
} = window.CharacterSheetTooltips || {};

const {
  exportConfiguration
} = window.CharacterSheetExport || {};

const {
  createDragManager
} = window.CharacterSheetDrag || {};

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundCoordinate(value) {
  return Number(value.toFixed(2));
}

function calculateCoordinates(event, sheet) {
  const rect = sheet.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return {
    x: roundCoordinate(clamp(x, 0, 100)),
    y: roundCoordinate(clamp(y, 0, 100))
  };
}

function generateFieldId(fields) {
  let number = fields.length + 1;
  let id = `field-${number}`;

  while (fields.some((field) => field.id === id)) {
    number += 1;
    id = `field-${number}`;
  }

  return id;
}

function generateTooltipId(tooltips) {
  let number = tooltips.length + 1;
  let id = `tooltip-${number}`;

  while (tooltips.some((tooltip) => tooltip.id === id)) {
    number += 1;
    id = `tooltip-${number}`;
  }

  return id;
}

function initializeCharacterSheet() {
  const config = window.characterSheetConfig;

  if (!config || !Array.isArray(config.fields)) {
    console.error("window.characterSheetConfig.fields est introuvable.");
    return;
  }
  if (!Array.isArray(config.tooltips)) {
    config.tooltips = [];
  }
  const sheet = document.querySelector(".character-sheet");
  const overlay = document.querySelector("#sheet-overlay");
  const tooltipOverlay = document.querySelector("#sheet-tooltips");

  const editButton = document.querySelector("#toggle-edit-mode");
  const tooltipModeButton = document.querySelector("#toggle-tooltip-mode");
  const exportButton = document.querySelector("#export-config");
  const toolbar = document.querySelector(".sheet-editor-toolbar");

  const editor = document.querySelector("#field-editor");
  const editorTitle = document.querySelector("#field-editor-title");

  const idInput = document.querySelector("#field-id");
  const valueInput = document.querySelector("#field-value");
  const sizeInput = document.querySelector("#field-size");

  const xDisplay = document.querySelector("#field-x-display");
  const yDisplay = document.querySelector("#field-y-display");

  const saveButton = document.querySelector("#save-field");
  const deleteButton = document.querySelector("#delete-field");
  const cancelButton = document.querySelector("#cancel-field");

  const tooltipEditor = document.querySelector("#tooltip-editor");
  const tooltipEditorTitle = document.querySelector("#tooltip-editor-title");

  const tooltipIdInput = document.querySelector("#tooltip-id");
  const tooltipTitleInput = document.querySelector("#tooltip-title");
  const tooltipTextInput = document.querySelector("#tooltip-text");
  const tooltipWidthInput = document.querySelector("#tooltip-width");
  const tooltipHeightInput = document.querySelector("#tooltip-height");

  const tooltipXDisplay = document.querySelector("#tooltip-x-display");
  const tooltipYDisplay = document.querySelector("#tooltip-y-display");

  const saveTooltipButton = document.querySelector("#save-tooltip");
  const deleteTooltipButton = document.querySelector("#delete-tooltip");
  const cancelTooltipButton = document.querySelector("#cancel-tooltip");

  const secretSequence = ["e", "d", "i", "t"];
  let typedSequence = [];

  function revealToolbar() {
    toolbar?.classList.add("toolbar-visible");
  }

  function recordTypedKey(key) {
    if (!toolbar || toolbar.classList.contains("toolbar-visible")) {
      return;
    }

    const nextIndex = typedSequence.length;
    if (key === secretSequence[nextIndex]) {
      typedSequence.push(key);
      if (typedSequence.length === secretSequence.length) {
        revealToolbar();
        typedSequence = [];
      }
      return;
    }

    typedSequence = key === "e" ? ["e"] : [];
  }

  if (
    !sheet ||
    !overlay ||
    !tooltipOverlay ||
    !editButton ||
    !tooltipModeButton ||
    !exportButton ||
    !editor ||
    !tooltipEditor ||
    !tooltipIdInput ||
    !tooltipTitleInput ||
    !tooltipTextInput ||
    !tooltipWidthInput ||
    !tooltipHeightInput ||
    !tooltipXDisplay ||
    !tooltipYDisplay ||
    !saveTooltipButton ||
    !deleteTooltipButton ||
    !cancelTooltipButton
  ) {
    console.error("Certains éléments de l’éditeur sont introuvables.");
    return;
  }

  let editMode = false;
  let pendingX = 0;
  let pendingY = 0;
  let selectedField = null;
  let selectedElement = null;
  let ignoreNextClick = false;
  let tooltipMode = false;
  let selectedTooltip = null;

  function updateCoordinateDisplays(x, y) {
    pendingX = x;
    pendingY = y;

    xDisplay.textContent = `x : ${x}`;
    yDisplay.textContent = `y : ${y}`;
    tooltipXDisplay.textContent = `x : ${x}`;
    tooltipYDisplay.textContent = `y : ${y}`;
  }

  function clearSelection() {
    selectedElement?.classList.remove("is-selected");
    selectedField = null;
    selectedTooltip = null;
    selectedElement = null;
  }

  function selectField(field, element) {
    clearSelection();

    selectedField = field;
    selectedElement = element;
    selectedElement.classList.add("is-selected");
  }

  function selectTooltip(tooltip, element) {
    clearSelection();

    selectedTooltip = tooltip;
    selectedElement = element;
    selectedElement.classList.add("is-selected");
  }

  function openNewFieldEditor(x, y) {
    clearSelection();

    pendingX = x;
    pendingY = y;

    editorTitle.textContent = "Ajouter un texte";

    idInput.value = generateFieldId(config.fields);
    valueInput.value = "";
    sizeInput.value = "2";

    xDisplay.textContent = `x : ${pendingX}`;
    yDisplay.textContent = `y : ${pendingY}`;

    saveButton.textContent = "Ajouter";
    deleteButton.hidden = true;

    editor.hidden = false;
    tooltipEditor.hidden = true;

    valueInput.focus();
  }

  function openNewTooltipEditor(x, y) {
    clearSelection();

    pendingX = x;
    pendingY = y;

    tooltipEditorTitle.textContent = "Ajouter une info-bulle";

    tooltipIdInput.value = generateTooltipId(config.tooltips);
    tooltipTitleInput.value = "";
    tooltipTextInput.value = "";
    tooltipWidthInput.value = "6";
    tooltipHeightInput.value = "6";

    tooltipXDisplay.textContent = `x : ${pendingX}`;
    tooltipYDisplay.textContent = `y : ${pendingY}`;

    saveTooltipButton.textContent = "Ajouter";
    deleteTooltipButton.hidden = true;

    tooltipEditor.hidden = false;
    editor.hidden = true;

    tooltipTitleInput.focus();
  }

  function openExistingFieldEditor(field, element) {
    if (!editMode) {
      return;
    }

    selectField(field, element);

    pendingX = field.x;
    pendingY = field.y;

    editorTitle.textContent = "Modifier le texte";

    idInput.value = field.id;
    valueInput.value = field.value;
    sizeInput.value = field.size ?? 2;

    xDisplay.textContent = `x : ${field.x}`;
    yDisplay.textContent = `y : ${field.y}`;

    tooltipEditor.hidden = true;
    editor.hidden = false;

    saveButton.textContent = "Enregistrer";
    deleteButton.hidden = false;

    valueInput.focus();
    valueInput.select();
  }

  function openExistingTooltipEditor(tooltip, element) {
    if (!editMode) {
      return;
    }

    selectTooltip(tooltip, element);

    pendingX = tooltip.x;
    pendingY = tooltip.y;

    tooltipEditorTitle.textContent = "Modifier l’info-bulle";

    tooltipIdInput.value = tooltip.id;
    tooltipTitleInput.value = tooltip.title ?? "";
    tooltipTextInput.value = tooltip.text ?? "";
    tooltipWidthInput.value = tooltip.width ?? 6;
    tooltipHeightInput.value = tooltip.height ?? 6;

    tooltipXDisplay.textContent = `x : ${tooltip.x}`;
    tooltipYDisplay.textContent = `y : ${tooltip.y}`;

    tooltipEditor.hidden = false;
    editor.hidden = true;

    saveTooltipButton.textContent = "Enregistrer";
    deleteTooltipButton.hidden = false;

    tooltipTitleInput.focus();
    tooltipTitleInput.select();
  }

  function closeEditor() {
    editor.hidden = true;
    tooltipEditor.hidden = true;
    clearSelection();
  }

  function addTooltip() {
    const id = tooltipIdInput.value.trim();
    const title = tooltipTitleInput.value.trim();
    const text = tooltipTextInput.value;
    const width = Number(tooltipWidthInput.value);
    const height = Number(tooltipHeightInput.value);

    if (!id) {
      alert("L’identifiant est obligatoire.");
      tooltipIdInput.focus();
      return;
    }

    if (config.tooltips.some((tooltip) => tooltip.id === id)) {
      alert(`L’identifiant "${id}" existe déjà.`);
      tooltipIdInput.focus();
      return;
    }

    const tooltip = {
      id,
      x: pendingX,
      y: pendingY,
      width: Number.isFinite(width) ? width : 6,
      height: Number.isFinite(height) ? height : 6,
      title,
      text
    };

    config.tooltips.push(tooltip);

    tooltipOverlay.appendChild(
      createTooltipElement(tooltip, {
        startDragging: dragManager.startDragging,
        onTooltipDblClick: openExistingTooltipEditor,
        isEditMode: () => editMode
      })
    );

    closeEditor();
  }

  function updateSelectedTooltip() {
    if (!selectedTooltip || !selectedElement) {
      return;
    }

    const newId = tooltipIdInput.value.trim();
    const title = tooltipTitleInput.value.trim();
    const text = tooltipTextInput.value;
    const width = Number(tooltipWidthInput.value);
    const height = Number(tooltipHeightInput.value);

    if (!newId) {
      alert("L’identifiant est obligatoire.");
      return;
    }

    const duplicate = config.tooltips.some(
      (tooltip) => tooltip !== selectedTooltip && tooltip.id === newId
    );

    if (duplicate) {
      alert(`L’identifiant "${newId}" existe déjà.`);
      return;
    }

    selectedTooltip.id = newId;
    selectedTooltip.title = title;
    selectedTooltip.text = text;
    selectedTooltip.width = Number.isFinite(width) ? width : 6;
    selectedTooltip.height = Number.isFinite(height) ? height : 6;

    updateTooltipElement(selectedTooltip, selectedElement);
    closeEditor();
  }

  function deleteSelectedTooltip() {
    if (!selectedTooltip) {
      return;
    }

    const confirmed = confirm(
      `Supprimer l’info-bulle "${selectedTooltip.id}" ?`
    );

    if (!confirmed) {
      return;
    }

    const index = config.tooltips.indexOf(selectedTooltip);
    if (index !== -1) {
      config.tooltips.splice(index, 1);
    }

    selectedElement?.remove();
    closeEditor();
  }

  function toggleTooltipMode() {
    if (!editMode) {
      return;
    }

    tooltipMode = !tooltipMode;
    tooltipModeButton.classList.toggle("is-active", tooltipMode);
  }

  const dragManager = createDragManager({
    calculateCoordinates: (event) => calculateCoordinates(event, sheet),
    selectItem: (item, element) => {
      if (item && item.text !== undefined) {
        selectTooltip(item, element);
      } else {
        selectField(item, element);
      }
    },
    openExistingItemEditor: (item, element) => {
      if (item && item.text !== undefined) {
        openExistingTooltipEditor(item, element);
      } else {
        openExistingFieldEditor(item, element);
      }
    },
    setIgnoreNextClick: (value) => {
      ignoreNextClick = value;
    },
    updateCoordinateDisplays,
    isEditMode: () => editMode
  });

  function addField() {
    const id = idInput.value.trim();
    const value = valueInput.value;
    const size = Number(sizeInput.value);

    if (!id) {
      alert("L’identifiant est obligatoire.");
      idInput.focus();
      return;
    }

    if (config.fields.some((field) => field.id === id)) {
      alert(`L’identifiant "${id}" existe déjà.`);
      idInput.focus();
      return;
    }

    const field = {
      id,
      value,
      x: pendingX,
      y: pendingY,
      size: Number.isFinite(size) ? size : 2
    };

    config.fields.push(field);

    overlay.appendChild(
      createFieldElement(field, {
        startDragging: dragManager.startDragging,
        onFieldDblClick: openExistingFieldEditor,
        isEditMode: () => editMode
      })
    );

    closeEditor();
  }

  function updateSelectedField() {
    if (!selectedField || !selectedElement) {
      return;
    }

    const newId = idInput.value.trim();
    const newValue = valueInput.value;
    const newSize = Number(sizeInput.value);

    if (!newId) {
      alert("L’identifiant est obligatoire.");
      return;
    }

    const duplicate = config.fields.some(
      (field) => field !== selectedField && field.id === newId
    );

    if (duplicate) {
      alert(`L’identifiant "${newId}" existe déjà.`);
      return;
    }

    selectedField.id = newId;
    selectedField.value = newValue;
    selectedField.size = Number.isFinite(newSize) ? newSize : 2;

    updateFieldElement(selectedField, selectedElement);

    closeEditor();
  }

  function deleteSelectedField() {
    if (!selectedField) {
      return;
    }

    const confirmed = confirm(
      `Supprimer le champ "${selectedField.id}" ?`
    );

    if (!confirmed) {
      return;
    }

    const index = config.fields.indexOf(selectedField);

    if (index !== -1) {
      config.fields.splice(index, 1);
    }

    selectedElement?.remove();
    closeEditor();
  }

  function exportConfig() {
    exportConfiguration(config, "perceval.config.js");
  }

  function toggleEditMode() {
    editMode = !editMode;

    sheet.classList.toggle("edit-mode", editMode);
    editButton.classList.toggle("is-active", editMode);

    editButton.textContent = editMode
      ? "Désactiver le mode édition"
      : "Activer le mode édition";

    tooltipModeButton.disabled = !editMode;

    if (!editMode) {
      tooltipMode = false;

      tooltipModeButton.disabled = true;
      tooltipModeButton.classList.remove("is-active");

      closeEditor();
    }
  }

  editButton.addEventListener("click", toggleEditMode);

  tooltipModeButton.addEventListener(
    "click",
    toggleTooltipMode
  );

  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const isTextInput =
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable);

    if (!isTextInput && event.key.length === 1) {
      recordTypedKey(event.key.toLowerCase());
    }
  });

  sheet.addEventListener("click", (event) => {
    if (!editMode || ignoreNextClick) {
      return;
    }

    // Ne pas créer un nouvel élément lorsqu’on clique
    // sur un texte ou une infobulle déjà existante.
    if (
      event.target.closest(".sheet-field") ||
      event.target.closest(".sheet-tooltip-zone")
    ) {
      return;
    }

    const coordinates = calculateCoordinates(event, sheet);

    if (tooltipMode) {
      openNewTooltipEditor(
        coordinates.x,
        coordinates.y
      );
    } else {
      openNewFieldEditor(
        coordinates.x,
        coordinates.y
      );
    }
  });

  saveButton.addEventListener("click", () => {
    if (selectedField) {
      updateSelectedField();
    } else {
      addField();
    }
  });

  saveTooltipButton.addEventListener("click", () => {
    if (selectedTooltip) {
      updateSelectedTooltip();
    } else {
      addTooltip();
    }
  });

  deleteButton.addEventListener("click", deleteSelectedField);
  cancelButton.addEventListener("click", closeEditor);
  exportButton.addEventListener("click", exportConfig);

  deleteTooltipButton.addEventListener(
    "click",
    deleteSelectedTooltip
  );

  cancelTooltipButton.addEventListener(
    "click",
    closeEditor
  );

  valueInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveButton.click();
    }

    if (event.key === "Escape") {
      closeEditor();
    }
  });

  renderFields(overlay, config.fields, {
    startDragging: dragManager.startDragging,
    onFieldDblClick: openExistingFieldEditor,
    isEditMode: () => editMode
  });

  renderTooltips(
    tooltipOverlay,
    config.tooltips,
    {
      startDragging: dragManager.startDragging,
      onTooltipDblClick: openExistingTooltipEditor,
      isEditMode: () => editMode
    }
  );
}

function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      callback,
      { once: true }
    );
  } else {
    callback();
  }
}

onReady(initializeCharacterSheet);
