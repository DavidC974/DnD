import { onUnmounted, ref } from "vue";

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundCoordinate(value) {
  return Math.round(value * 100) / 100;
}

export function useSheetDrag(editMode, onDragEnd) {
  const selectedItem = ref(null);
  const draggedItem = ref(null);
  const justDragged = ref(false);

  let draggedElement = null;
  let sheetElement = null;
  let pointerId = null;

  function coordinatesFromEvent(event) {
    const rect = sheetElement.getBoundingClientRect();

    return {
      x: roundCoordinate(
        clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      ),
      y: roundCoordinate(
        clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
      ),
    };
  }

  function stopDragging() {
    const item = draggedItem.value;

    if (
      draggedElement &&
      pointerId !== null &&
      draggedElement.hasPointerCapture?.(pointerId)
    ) {
      draggedElement.releasePointerCapture(pointerId);
    }

    document.removeEventListener("pointermove", moveDragging);
    document.removeEventListener("pointerup", stopDragging);
    document.removeEventListener("pointercancel", stopDragging);

    draggedItem.value = null;
    draggedElement = null;
    sheetElement = null;
    pointerId = null;

    if (item) {
      onDragEnd?.(item);
    }

    window.setTimeout(() => {
      justDragged.value = false;
    }, 0);
  }

  function moveDragging(event) {
    if (!draggedItem.value || !sheetElement) {
      return;
    }

    const coordinates = coordinatesFromEvent(event);
    justDragged.value = true;
    draggedItem.value.x = coordinates.x;
    draggedItem.value.y = coordinates.y;
  }

  function startDragging(event, item) {
    if (!editMode.value) {
      return;
    }

    const sheet = event.currentTarget.closest(".character-sheet");
    if (!sheet) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    selectedItem.value = item;
    draggedItem.value = item;
    draggedElement = event.currentTarget;
    sheetElement = sheet;
    pointerId = event.pointerId;

    draggedElement.setPointerCapture?.(pointerId);

    document.addEventListener("pointermove", moveDragging);
    document.addEventListener("pointerup", stopDragging);
    document.addEventListener("pointercancel", stopDragging);
  }

  function clearSelection() {
    selectedItem.value = null;
  }

  onUnmounted(stopDragging);

  return {
    clearSelection,
    draggedItem,
    justDragged,
    selectedItem,
    startDragging,
  };
}
