(function (window) {
  function exportConfiguration(config, fileName = "character-sheet.config.js") {
    const fileContent =
      `window.characterSheetConfig = ${JSON.stringify(config, null, 2)};\n`;

    const blob = new Blob([fileContent], {
      type: "text/javascript;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  window.CharacterSheetExport = {
    exportConfiguration
  };
})(window);
