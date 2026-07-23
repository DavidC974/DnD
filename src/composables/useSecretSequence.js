import { onMounted, onUnmounted, ref } from "vue";

export function useSecretSequence(secret = "edit") {
  const revealed = ref(false);
  let typed = "";

  function onKeydown(event) {
    const target = event.target;
    const isTextInput =
      target instanceof HTMLElement &&
      (target.matches("input, textarea") || target.isContentEditable);

    if (revealed.value || isTextInput || event.key.length !== 1) {
      return;
    }

    const key = event.key.toLowerCase();
    const expected = secret[typed.length];

    typed = key === expected ? typed + key : key === secret[0] ? key : "";

    if (typed === secret) {
      revealed.value = true;
      typed = "";
    }
  }

  onMounted(() => document.addEventListener("keydown", onKeydown));
  onUnmounted(() => document.removeEventListener("keydown", onKeydown));

  return { revealed };
}
