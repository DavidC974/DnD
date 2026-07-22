(function (window) {
  function createTooltipElement(tooltip, callbacks = {}) {
    const zone = document.createElement("div");

    zone.className = "sheet-tooltip-zone";
    zone.dataset.tooltipId = tooltip.id;

    zone.style.left = `${tooltip.x}%`;
    zone.style.top = `${tooltip.y}%`;
    zone.style.width = `${tooltip.width ?? 4}%`;
    zone.style.height = `${tooltip.height ?? 4}%`;

    zone.tabIndex = 0;

    zone.setAttribute(
      "aria-label",
      `${tooltip.title ?? "Information"} : ${tooltip.text ?? ""}`
    );

    const content = document.createElement("div");
    content.className = "sheet-tooltip-content";

    fillTooltipContent(content, tooltip);

    zone.appendChild(content);

    zone.addEventListener("pointerdown", (event) => {
      callbacks.startDragging?.(
        event,
        tooltip,
        zone
      );
    });

    zone.addEventListener("dblclick", (event) => {
      if (
        callbacks.isEditMode &&
        !callbacks.isEditMode()
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      callbacks.onTooltipDblClick?.(
        tooltip,
        zone
      );
    });

    return zone;
  }

  function fillTooltipContent(content, tooltip) {
    content.innerHTML = "";

    if (tooltip.title) {
      const title = document.createElement("strong");

      title.className = "sheet-tooltip-title";
      title.textContent = tooltip.title;

      content.appendChild(title);
    }

    const text = document.createElement("span");

    text.textContent = tooltip.text ?? "";

    content.appendChild(text);
  }

  function updateTooltipElement(tooltip, element) {
    element.dataset.tooltipId = tooltip.id;

    element.style.left = `${tooltip.x}%`;
    element.style.top = `${tooltip.y}%`;
    element.style.width = `${tooltip.width ?? 4}%`;
    element.style.height = `${tooltip.height ?? 4}%`;

    element.setAttribute(
      "aria-label",
      `${tooltip.title ?? "Information"} : ${tooltip.text ?? ""}`
    );

    const content = element.querySelector(
      ".sheet-tooltip-content"
    );

    if (content) {
      fillTooltipContent(content, tooltip);
    }
  }

  function renderTooltips(tooltipOverlay, tooltips, callbacks = {}) {
    tooltipOverlay.innerHTML = "";

    if (!Array.isArray(tooltips)) {
      return;
    }

    tooltips.forEach((tooltip) => {
      const element = createTooltipElement(
        tooltip,
        callbacks
      );

      tooltipOverlay.appendChild(element);
    });
  }

  window.CharacterSheetTooltips = {
    createTooltipElement,
    updateTooltipElement,
    renderTooltips
  };
})(window);
