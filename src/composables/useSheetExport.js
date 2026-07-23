export function useSheetExport() {
  function exportConfiguration(config, characterId) {
    const variableName = `${characterId}Sheet`;
    const content =
      `const ${variableName} = ${JSON.stringify(config, null, 2)};\n\n` +
      `export default ${variableName};\n`;
    const blob = new Blob([content], {
      type: "text/javascript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${characterId}.js`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return { exportConfiguration };
}
