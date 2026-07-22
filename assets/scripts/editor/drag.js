(function (window) {
  function createDragManager(options) {
    const {
      calculateCoordinates,
      selectItem,
      openExistingItemEditor,
      setIgnoreNextClick,
      updateCoordinateDisplays,
      isEditMode
    } = options;

    let draggedItem = null;
    let draggedElement = null;

    function startDragging(event, item, element) {
      if (!isEditMode?.()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      selectItem?.(item, element);

      draggedItem = item;
      draggedElement = element;

      draggedElement.classList.add("is-dragging");
      draggedElement.setPointerCapture(event.pointerId);

      document.addEventListener("pointermove", dragField);
      document.addEventListener("pointerup", stopDragging, {
        once: true
      });
    }

    function dragField(event) {
      if (!draggedItem || !draggedElement) {
        return;
      }

      setIgnoreNextClick?.(true);

      const coordinates = calculateCoordinates(event);

      draggedItem.x = coordinates.x;
      draggedItem.y = coordinates.y;

      draggedElement.style.left = `${coordinates.x}%`;
      draggedElement.style.top = `${coordinates.y}%`;

      updateCoordinateDisplays?.(coordinates.x, coordinates.y);
    }

    function stopDragging() {
      draggedElement?.classList.remove("is-dragging");
      document.removeEventListener("pointermove", dragField);

      if (draggedItem && draggedElement) {
        openExistingItemEditor?.(draggedItem, draggedElement);
      }

      draggedItem = null;
      draggedElement = null;

      window.setTimeout(() => {
        setIgnoreNextClick?.(false);
      }, 0);
    }

    return {
      startDragging
    };
  }

  window.CharacterSheetDrag = {
    createDragManager
  };
})(window);
