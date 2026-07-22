(function () {
  const loaderBaseUrl = new URL(".", document.currentScript.src).href;

  const scriptPaths = [
    "toolbar.js",
    "fields.js",
    "tooltips.js",
    "export.js",
    "drag.js",
    "editors.js",
    "sheet.js"
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL(src, loaderBaseUrl).href;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Échec du chargement de ${src}`));
      document.body.appendChild(script);
    });
  }

  function loadAllScripts() {
    scriptPaths.reduce(
      (previous, src) => previous.then(() => loadScript(src)),
      Promise.resolve()
    ).catch((error) => {
      console.error("Erreur de chargement des scripts de l’éditeur :", error);
    });
  }

  loadAllScripts();
})();
