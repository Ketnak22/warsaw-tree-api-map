export const WARSAW_CENTER = [52.2297, 21.0122];

// API Warszawy obsługuje bardzo duże limity w jednym żądaniu, więc stronicowanie to zwykle 1-2 zapytania.
export const MAX_RECORDS_PER_REQUEST = 100000;

export const VIEW_CONFIG = {
  TREES: {
    label: "Mapa drzew",
    title: "Drzewa w Warszawie",
    description: "Podgląd danych drzew i grup drzew z endpointu",
    resourceOptions: [
      { value: "TREES", label: "Pojedyncze drzewa" },
      { value: "GROUPS", label: "Grupy drzew" },
    ],
  },
  SHRUBS: {
    label: "Mapa krzewów",
    title: "Krzewy w Warszawie",
    description: "Podgląd danych krzewów z endpointu",
    resourceOptions: [{ value: "SHRUBS", label: "Krzewy" }],
  },
  FORESTS: {
    label: "Mapa lasów",
    title: "Lasy w Warszawie",
    description: "Podgląd wydzieleń leśnych z endpointu",
    resourceOptions: [{ value: "FORESTS", label: "Lasy" }],
  },
};

export const MARKER_STYLES = {
  TREES: { radius: 6, color: "#184b34", fillColor: "#36a46c" },
  GROUPS: { radius: 10, color: "#2a4d69", fillColor: "#4b86b4" },
  SHRUBS: { radius: 5, color: "#7a4f1d", fillColor: "#c8893f" },
  FORESTS: { radius: 7, color: "#2f2d1f", fillColor: "#6b7a2b" },
};
