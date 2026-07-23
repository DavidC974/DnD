<script setup>
import { ref, watch } from "vue";
import { useFieldEditor } from "../composables/useFieldEditor.js";
import { useSecretSequence } from "../composables/useSecretSequence.js";
import { useSheetDrag } from "../composables/useSheetDrag.js";
import { useSheetExport } from "../composables/useSheetExport.js";
import { useTooltipEditor } from "../composables/useTooltipEditor.js";
import TooltipZonesToggle from "../components/molecules/TooltipZonesToggle.vue";
import CharacterHeader from "../components/organisms/CharacterHeader.vue";
import CharacterSheet from "../components/organisms/CharacterSheet.vue";
import FieldEditor from "../components/organisms/FieldEditor.vue";
import SheetEditorToolbar from "../components/organisms/SheetEditorToolbar.vue";
import SheetFieldOverlay from "../components/organisms/SheetFieldOverlay.vue";
import SheetTooltipOverlay from "../components/organisms/SheetTooltipOverlay.vue";
import TooltipEditor from "../components/organisms/TooltipEditor.vue";

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
});

const sheetConfig = ref(null);
const showTooltipZones = ref(true);
const editMode = ref(false);
const tooltipMode = ref(false);
const { revealed: toolbarVisible } = useSecretSequence("edit");
const { exportConfiguration } = useSheetExport();
const fieldEditor = useFieldEditor();
const tooltipEditor = useTooltipEditor();

let handleDragEnd = () => {};
const {
  clearSelection,
  draggedItem,
  justDragged,
  selectedItem,
  startDragging,
} = useSheetDrag(editMode, (item) => handleDragEnd(item));

handleDragEnd = (item) => {
  if (Object.hasOwn(item, "value")) {
    tooltipEditor.close();
    fieldEditor.openExisting(item);
  } else if (Object.hasOwn(item, "text")) {
    fieldEditor.close();
    tooltipEditor.openExisting(item);
  }
};

watch(
  () => props.character,
  async (character) => {
    sheetConfig.value = null;
    showTooltipZones.value = true;
    editMode.value = false;
    tooltipMode.value = false;
    toolbarVisible.value = false;
    clearSelection();
    fieldEditor.close();
    tooltipEditor.close();

    if (character.loadSheetConfig) {
      const module = await character.loadSheetConfig();
      sheetConfig.value = structuredClone(module.default);
    }
  },
  { immediate: true },
);

function toggleEditMode() {
  editMode.value = !editMode.value;

  if (!editMode.value) {
    tooltipMode.value = false;
    clearSelection();
    fieldEditor.close();
    tooltipEditor.close();
  }
}

function toggleTooltipMode() {
  if (!editMode.value) {
    return;
  }

  tooltipMode.value = !tooltipMode.value;
  clearSelection();
  fieldEditor.close();
  tooltipEditor.close();
}

function sheetCoordinates(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clamp = (value) => Math.min(Math.max(value, 0), 100);
  const round = (value) => Math.round(value * 100) / 100;

  return {
    x: round(clamp(((event.clientX - rect.left) / rect.width) * 100)),
    y: round(clamp(((event.clientY - rect.top) / rect.height) * 100)),
  };
}

function handleSheetClick(event) {
  if (
    !editMode.value ||
    !sheetConfig.value ||
    justDragged.value ||
    event.target.closest(".sheet-field, .sheet-tooltip-zone")
  ) {
    return;
  }

  const coordinates = sheetCoordinates(event);
  clearSelection();

  if (tooltipMode.value) {
    fieldEditor.close();
    tooltipEditor.openNew(sheetConfig.value.tooltips, coordinates);
  } else {
    tooltipEditor.close();
    fieldEditor.openNew(sheetConfig.value.fields, coordinates);
  }
}

function openFieldEditor(field) {
  tooltipEditor.close();
  selectedItem.value = field;
  fieldEditor.openExisting(field);
}

function openTooltipEditor(tooltip) {
  fieldEditor.close();
  selectedItem.value = tooltip;
  tooltipEditor.openExisting(tooltip);
}

function closeFieldEditor() {
  fieldEditor.close();
  clearSelection();
}

function saveField() {
  if (fieldEditor.save(sheetConfig.value.fields)) {
    clearSelection();
  }
}

function deleteField() {
  if (fieldEditor.remove(sheetConfig.value.fields)) {
    clearSelection();
  }
}

function closeTooltipEditor() {
  tooltipEditor.close();
  clearSelection();
}

function saveTooltip() {
  if (tooltipEditor.save(sheetConfig.value.tooltips)) {
    clearSelection();
  }
}

function deleteTooltip() {
  if (tooltipEditor.remove(sheetConfig.value.tooltips)) {
    clearSelection();
  }
}

function exportSheet() {
  if (sheetConfig.value) {
    exportConfiguration(sheetConfig.value, props.character.id);
  }
}
</script>

<template>
  <main class="page-shell character-page">
    <CharacterHeader :character-name="character.name">
      <template v-if="character.showTooltipToggle" #actions>
        <TooltipZonesToggle v-model="showTooltipZones" />
      </template>
    </CharacterHeader>

    <SheetEditorToolbar
      v-if="sheetConfig"
      :visible="toolbarVisible"
      :edit-mode="editMode"
      :tooltip-mode="tooltipMode"
      @toggle-edit="toggleEditMode"
      @toggle-tooltip="toggleTooltipMode"
      @export="exportSheet"
    />

    <CharacterSheet
      :character-name="character.name"
      :image-url="character.sheetImage"
      :show-tooltip-zones="showTooltipZones"
      :edit-mode="editMode"
      @sheet-click="handleSheetClick"
    >
      <template v-if="sheetConfig">
        <SheetFieldOverlay
          :fields="sheetConfig.fields"
          :character-name="character.name"
          :edit-mode="editMode"
          :selected-item="selectedItem"
          :dragged-item="draggedItem"
          @item-pointerdown="startDragging"
          @edit-item="openFieldEditor"
        />
        <SheetTooltipOverlay
          :tooltips="sheetConfig.tooltips"
          :edit-mode="editMode"
          :selected-item="selectedItem"
          :dragged-item="draggedItem"
          @item-pointerdown="startDragging"
          @edit-item="openTooltipEditor"
        />
      </template>
    </CharacterSheet>

    <FieldEditor
      :open="fieldEditor.open.value"
      :draft="fieldEditor.draft"
      :editing="Boolean(fieldEditor.selectedField.value)"
      @save="saveField"
      @delete="deleteField"
      @cancel="closeFieldEditor"
    />

    <TooltipEditor
      :open="tooltipEditor.open.value"
      :draft="tooltipEditor.draft"
      :editing="Boolean(tooltipEditor.selectedTooltip.value)"
      @save="saveTooltip"
      @delete="deleteTooltip"
      @cancel="closeTooltipEditor"
    />
  </main>
</template>
