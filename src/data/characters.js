import percevalSheetImage from "../assets/images/sheets/characteristic/Perceval.webp";
import toshiSheetImage from "../assets/images/sheets/characteristic/Toshi.webp";

export const characters = [
  {
    id: "toshi",
    name: "Toshi",
    directory: "Toshi",
    sheetImage: toshiSheetImage,
    showTooltipToggle: true,
    loadSheetConfig: () => import("./sheets/toshi.js"),
  },
  {
    id: "perceval",
    name: "Perceval",
    directory: "Perceval",
    sheetImage: percevalSheetImage,
    loadSheetConfig: () => import("./sheets/perceval.js"),
  },
  {
    id: "sung",
    name: "Sung",
    directory: "Sung",
    sheetImage: null,
    loadSheetConfig: null,
  },
  {
    id: "gorak",
    name: "Gorak",
    directory: "Gorak",
    sheetImage: null,
    loadSheetConfig: null,
  },
  {
    id: "meluzine",
    name: "Meluzine",
    directory: "Meluzine",
    sheetImage: null,
    loadSheetConfig: null,
  },
  {
    id: "lux",
    name: "Lux",
    directory: "Lux",
    sheetImage: null,
    loadSheetConfig: null,
  },
  {
    id: "zarek",
    name: "Zarek",
    directory: "Zarek",
    sheetImage: null,
    loadSheetConfig: null,
  },
  {
    id: "drannor",
    name: "Drannor",
    directory: "Drannor",
    sheetImage: null,
    loadSheetConfig: null,
  },
];

export function findCharacter(characterId) {
  return characters.find(({ id }) => id === characterId);
}
