import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import { buildApiUrl, fetchPagedRecords, fetchSinglePage } from "./api";
import { normalizeRecord } from "./normalize";
import RecordPopup from "./components/RecordPopup";
import ResultsTable from "./components/ResultsTable";
import { MARKER_STYLES, MAX_RECORDS_PER_REQUEST, VIEW_CONFIG, WARSAW_CENTER } from "./config";

function MapBoundsSetter({ records }) {
  const map = useMap();

  useEffect(() => {
    if (records.length === 0) {
      map.setView(WARSAW_CENTER, 11);
      return;
    }

    const bounds = L.latLngBounds(records.map((record) => [record.lat, record.lon]));
    map.fitBounds(bounds.pad(0.14), { maxZoom: 16 });
  }, [records, map]);

  return null;
}

function App() {
  const [activeView, setActiveView] = useState("TREES");
  const [resourceType, setResourceType] = useState("TREES");
  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(50);
  const [noLimit, setNoLimit] = useState(false);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("Gotowe do pobrania danych.");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState("");

  const currentView = VIEW_CONFIG[activeView];
  // Memoized so the map only refits when new data arrives, not on every keystroke in the form.
  const recordsWithCoords = useMemo(
    () => records.filter((record) => record.lat !== null && record.lon !== null),
    [records]
  );
  const currentResourceType = activeView === "TREES" ? resourceType : activeView;
  const itemLabel = activeView === "SHRUBS" ? "krzewy" : activeView === "FORESTS" ? "lasy" : "drzewa";

  useEffect(() => {
    setRecords([]);
    setStatus(`Gotowe do pobrania danych dla widoku: ${currentView.label.toLowerCase()}.`);
    setIsError(false);
    setEndpointUrl("");

    if (activeView !== "TREES") {
      setResourceType(activeView);
    } else if (resourceType === "SHRUBS" || resourceType === "FORESTS") {
      setResourceType("TREES");
    }
  }, [activeView]);

  const loadRecords = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setRecords([]);

    const params = {
      resourceType: currentResourceType,
      district: district.trim(),
      query: query.trim(),
      limit: noLimit ? undefined : Math.min(Math.max(limit || 1, 1), MAX_RECORDS_PER_REQUEST),
    };

    const previewUrl = buildApiUrl(params);
    setEndpointUrl(new URL(previewUrl, window.location.origin).toString());

    try {
      let rawRecords = [];

      if (noLimit) {
        rawRecords = await fetchPagedRecords({
          resourceType: currentResourceType,
          district: params.district,
          query: params.query,
          onProgress: ({ offset, total, url }) => {
            setEndpointUrl(url);
            setStatus(
              total === null
                ? `Pobieram dane (offset ${offset})...`
                : `Pobieram dane (${Math.min(offset + MAX_RECORDS_PER_REQUEST, total)} / ${total})...`
            );
          },
        });
      } else {
        setStatus("Pobieram dane z API UM Warszawa...");
        rawRecords = await fetchSinglePage(previewUrl);
      }

      const normalized = rawRecords.map((record) => normalizeRecord(record, currentResourceType));
      setRecords(normalized);
      setStatus(`Pobrano ${normalized.length} rekordów.`);
    } catch (error) {
      console.error(error);
      setStatus(`Nie udało się pobrać danych: ${error.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadGeoJson = () => {
    const geojson = {
      type: "FeatureCollection",
      features: recordsWithCoords.map((record) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [record.lon, record.lat] },
        properties: {
          gatunek: record.species,
          gatunek_lacina: record.speciesLatin,
          dzielnica: record.district,
          adres: record.address,
          nr_adres: record.addressNumber,
          lokalizacja: record.location,
          wysokosc: record.height,
          obwod: record.circumference,
          srednica_korony: record.crownDiameter,
          stan_zdrowia: record.health,
          wiek_dni: record.ageDays,
          data_pomiaru: record.measurementDate,
          nr_inw: record.inventoryNumber,
          jednostka: record.entity,
          id_obrysu: record.outlineId,
          source: record.raw,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      activeView === "SHRUBS"
        ? "warszawa-krzewy.geojson"
        : activeView === "FORESTS"
          ? "warszawa-lasy.geojson"
          : "warszawa-drzewa.geojson";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="eyebrow">API UM Warszawa</span>
          <strong>Mapa zieleni</strong>
        </div>
        <nav className="topbar-tabs" aria-label="Widoki mapy">
          {Object.entries(VIEW_CONFIG).map(([key, view]) => (
            <button
              key={key}
              type="button"
              className={`tab-button ${activeView === key ? "active" : ""}`}
              onClick={() => setActiveView(key)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-shell">
        <section className="control-panel">
          <div className="title-block">
            {activeView === "TREES" ? (
              <>
                <p className="eyebrow">API UM Warszawa</p>
                <h1>Drzewa w Warszawie</h1>
                <p className="lead">
                  Testowy podgląd danych z endpointu <code>datastore_search</code>.
                </p>
                <p className="source-link">
                  <a
                    href="https://pl.doczz.net/doc/1897859/drzewa---api-um-warszawa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ Zobacz dokumentację źródłową API
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">CKAN datastore_search</p>
                <h1>{currentView.title}</h1>
                <p className="lead">
                  {currentView.description} <code>datastore_search</code>.
                </p>
                <p className="source-link">
                  <a
                    href="https://api.um.warszawa.pl/api/action/datastore_search"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Otwórz endpoint API
                  </a>
                </p>
              </>
            )}
          </div>

          <form className="filters" onSubmit={loadRecords}>
            {activeView === "TREES" ? (
              <label>
                Typ zasobu
                <select value={resourceType} onChange={(event) => setResourceType(event.target.value)}>
                  {currentView.resourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                Typ zasobu
                <input value={activeView === "FORESTS" ? "Lasy" : "Krzewy"} disabled readOnly />
              </label>
            )}

            <label>
              Dzielnica
              <input value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="np. Wola" />
            </label>

            <label>
              Gatunek lub tekst
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="np. tawuła, żylistek"
              />
            </label>

            <label>
              Limit
              <input
                type="number"
                value={limit}
                onChange={(event) => setLimit(parseInt(event.target.value, 10) || 1)}
                disabled={noLimit}
                min="1"
                max={MAX_RECORDS_PER_REQUEST}
              />
            </label>

            <label className="nolimit">
              <input type="checkbox" checked={noLimit} onChange={(event) => setNoLimit(event.target.checked)} />
              Bez limitu (pobierz wszystko)
            </label>

            <div className="actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Pobieranie..." : `Pobierz ${itemLabel}`}
              </button>
              <button type="button" className="secondary" disabled={records.length === 0} onClick={downloadGeoJson}>
                GeoJSON
              </button>
            </div>
          </form>

          <div className={`status-row ${isError ? "error" : ""}`}>
            <strong>{status}</strong>
            <span id="endpoint-preview">{endpointUrl}</span>
          </div>
        </section>

        <section className="map-panel">
          <MapContainer center={WARSAW_CENTER} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <MapBoundsSetter records={recordsWithCoords} />
            {recordsWithCoords.map((record, idx) => {
              const style = MARKER_STYLES[record.type];

              return (
                <CircleMarker
                  key={record.raw._id ?? idx}
                  center={[record.lat, record.lon]}
                  radius={style.radius}
                  color={style.color}
                  weight={2}
                  fillColor={style.fillColor}
                  fillOpacity={0.78}
                >
                  <RecordPopup record={record} />
                </CircleMarker>
              );
            })}
          </MapContainer>
        </section>

        <section className="results-panel">
          <div className="results-header">
            <h2>Wyniki</h2>
            <span>{records.length} rekordów</span>
          </div>
          <div className="table-wrap">
            <ResultsTable records={records} view={activeView} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
