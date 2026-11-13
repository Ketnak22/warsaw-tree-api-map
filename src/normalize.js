function pick(rec, keys) {
  for (const key of keys) {
    const value = rec[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "-";
}

export function normalizeRecord(record, resourceType) {
  const lon = Number(record.x_wgs84 ?? record.lon ?? record.longitude);
  const lat = Number(record.y_wgs84 ?? record.lat ?? record.latitude);

  if (resourceType === "FORESTS") {
    return {
      raw: record,
      lat: Number.isFinite(lat) ? lat : null,
      lon: Number.isFinite(lon) ? lon : null,
      district: pick(record, ["dzielnica"]),
      forestArea: pick(record, ["obwod", "obw\u00f3d"]),
      settlement: pick(record, ["osiedle"]),
      divisionNo: pick(record, ["nr_oddz"]),
      subDivision: pick(record, ["poddz"]),
      area: pick(record, ["powierzchnia"]),
      habitatType: pick(record, ["stl"]),
      layer: pick(record, ["powierzchnia1"]),
      dominantSpecies: pick(record, ["gat_panujacy"]),
      speciesShare: pick(record, ["udzial", "udzia\u0142"]),
      ageYears: pick(record, ["wiek"]),
      bonitation: pick(record, ["bonitacja"]),
      afforestation: pick(record, ["zadrzewienie"]),
      canopyClosure: pick(record, ["zwarcie"]),
      mixing: pick(record, ["zmieszanie"]),
      undergrowth: pick(record, ["podrost"]),
      understory: pick(record, ["podszyt"]),
      planType: pick(record, ["typ_planu"]),
      plan: pick(record, ["planu"]),
      planValidity: pick(record, ["obowiazywanie", "obowi\u0105zywanie"]),
      x: pick(record, ["x_pl2000"]),
      y: pick(record, ["y_pl2000"]),
      type: resourceType,
    };
  }

  return {
    raw: record,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    species: pick(record, ["gatunek", "gatunek_nazwa", "rodzaj"]),
    speciesLatin: pick(record, ["gatunek1", "gatunek_1", "nazwa_lacinska"]),
    district: pick(record, ["dzielnica", "district"]),
    address: pick(record, ["adres", "ulica", "miejsce", "adr_es"]),
    addressNumber: pick(record, ["numer_adres"]),
    location: pick(record, ["lokalizacja"]),
    height: pick(record, ["wysokosc", "wysokosc_m", "height"]),
    health: pick(record, ["stan_zdrowia", "stan", "kondycja"]),
    circumference: pick(record, ["pnie_obwod"]),
    crownDiameter: pick(record, ["srednica_k"]),
    ageDays: pick(record, ["wiek_w_dni"]),
    measurementDate: pick(record, ["data_wyk_pom"]),
    inventoryNumber: pick(record, ["numer_inw"]),
    entity: pick(record, ["jednostka"]),
    city: pick(record, ["miasto"]),
    x: pick(record, ["x", "x_pl2000"]),
    y: pick(record, ["y", "y_pl2000"]),
    outlineId: pick(record, ["id_obrysu"]),
    type: resourceType,
  };
}

