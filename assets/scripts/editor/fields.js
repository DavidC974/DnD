(function (window) {
  function createFieldElement(field, callbacks) {
    const element = document.createElement("span");

    element.className = "sheet-field";
    element.dataset.fieldId = field.id;
    element.textContent = field.value;

    element.style.left = `${field.x}%`;
    element.style.top = `${field.y}%`;
    element.style.fontSize = `${field.size ?? 2}cqw`;

    element.addEventListener("pointerdown", (event) => {
      callbacks.startDragging(event, field, element);
    });

    element.addEventListener("dblclick", (event) => {
      if (callbacks.isEditMode && !callbacks.isEditMode()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      callbacks.onFieldDblClick(field, element);
    });

    return element;
  }

  function renderFields(overlay, fields, callbacks) {
    overlay.innerHTML = "";

    fields.forEach((field) => {
      overlay.appendChild(createFieldElement(field, callbacks));
    });
  }

  function updateFieldElement(field, element) {
    element.dataset.fieldId = field.id;
    element.textContent = field.value;

    element.style.left = `${field.x}%`;
    element.style.top = `${field.y}%`;
    element.style.fontSize = `${field.size ?? 2}cqw`;
  }

  window.CharacterSheetFields = {
    createFieldElement,
    renderFields,
    updateFieldElement
  };
})(window);
