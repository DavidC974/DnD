import { reactive, ref } from "vue";

function generateTooltipId(tooltips) {
  let number = tooltips.length + 1;
  let id = `tooltip-${number}`;

  while (tooltips.some((tooltip) => tooltip.id === id)) {
    number += 1;
    id = `tooltip-${number}`;
  }

  return id;
}

export function useTooltipEditor() {
  const open = ref(false);
  const selectedTooltip = ref(null);
  const draft = reactive({
    id: "",
    title: "",
    text: "",
    width: 6,
    height: 6,
    x: 0,
    y: 0,
  });

  function fillDraft(tooltip) {
    draft.id = tooltip.id;
    draft.title = tooltip.title ?? "";
    draft.text = tooltip.text ?? "";
    draft.width = tooltip.width ?? 6;
    draft.height = tooltip.height ?? 6;
    draft.x = tooltip.x;
    draft.y = tooltip.y;
  }

  function openNew(tooltips, coordinates) {
    selectedTooltip.value = null;
    fillDraft({
      id: generateTooltipId(tooltips),
      title: "",
      text: "",
      width: 6,
      height: 6,
      ...coordinates,
    });
    open.value = true;
  }

  function openExisting(tooltip) {
    selectedTooltip.value = tooltip;
    fillDraft(tooltip);
    open.value = true;
  }

  function close() {
    open.value = false;
    selectedTooltip.value = null;
  }

  function save(tooltips) {
    const id = draft.id.trim();
    const width = Number(draft.width);
    const height = Number(draft.height);

    if (!id) {
      window.alert("L’identifiant est obligatoire.");
      return false;
    }

    const duplicate = tooltips.some(
      (tooltip) => tooltip !== selectedTooltip.value && tooltip.id === id,
    );

    if (duplicate) {
      window.alert(`L’identifiant « ${id} » existe déjà.`);
      return false;
    }

    const values = {
      id,
      title: draft.title.trim(),
      text: draft.text,
      width: Number.isFinite(width) ? width : 6,
      height: Number.isFinite(height) ? height : 6,
      x: draft.x,
      y: draft.y,
    };

    if (selectedTooltip.value) {
      Object.assign(selectedTooltip.value, values);
    } else {
      tooltips.push(values);
    }

    close();
    return true;
  }

  function remove(tooltips) {
    const tooltip = selectedTooltip.value;

    if (
      !tooltip ||
      !window.confirm(`Supprimer l’infobulle « ${tooltip.id} » ?`)
    ) {
      return false;
    }

    const index = tooltips.indexOf(tooltip);
    if (index !== -1) {
      tooltips.splice(index, 1);
    }

    close();
    return true;
  }

  return {
    close,
    draft,
    open,
    openExisting,
    openNew,
    remove,
    save,
    selectedTooltip,
  };
}
