import { reactive, ref } from "vue";

function generateFieldId(fields) {
  let number = fields.length + 1;
  let id = `field-${number}`;

  while (fields.some((field) => field.id === id)) {
    number += 1;
    id = `field-${number}`;
  }

  return id;
}

export function useFieldEditor() {
  const open = ref(false);
  const selectedField = ref(null);
  const draft = reactive({
    id: "",
    value: "",
    size: 2,
    x: 0,
    y: 0,
  });

  function fillDraft(field) {
    draft.id = field.id;
    draft.value = field.value;
    draft.size = field.size ?? 2;
    draft.x = field.x;
    draft.y = field.y;
  }

  function openNew(fields, coordinates) {
    selectedField.value = null;
    fillDraft({
      id: generateFieldId(fields),
      value: "",
      size: 2,
      ...coordinates,
    });
    open.value = true;
  }

  function openExisting(field) {
    selectedField.value = field;
    fillDraft(field);
    open.value = true;
  }

  function close() {
    open.value = false;
    selectedField.value = null;
  }

  function save(fields) {
    const id = draft.id.trim();
    const size = Number(draft.size);

    if (!id) {
      window.alert("L’identifiant est obligatoire.");
      return false;
    }

    const duplicate = fields.some(
      (field) => field !== selectedField.value && field.id === id,
    );

    if (duplicate) {
      window.alert(`L’identifiant « ${id} » existe déjà.`);
      return false;
    }

    const values = {
      id,
      value: draft.value,
      size: Number.isFinite(size) ? size : 2,
      x: draft.x,
      y: draft.y,
    };

    if (selectedField.value) {
      Object.assign(selectedField.value, values);
    } else {
      fields.push(values);
    }

    close();
    return true;
  }

  function remove(fields) {
    const field = selectedField.value;

    if (!field || !window.confirm(`Supprimer le champ « ${field.id} » ?`)) {
      return false;
    }

    const index = fields.indexOf(field);
    if (index !== -1) {
      fields.splice(index, 1);
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
    selectedField,
  };
}
