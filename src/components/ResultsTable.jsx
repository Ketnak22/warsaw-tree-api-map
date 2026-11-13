function EmptyRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty">
        Wybierz parametry i pobierz dane.
      </td>
    </tr>
  );
}

function Coords({ record }) {
  return (
    <td className="coords-cell">
      {record.lat !== null && record.lon !== null
        ? `${record.lat.toFixed(5)}, ${record.lon.toFixed(5)}`
        : "-"}
    </td>
  );
}

function ForestTable({ records }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Obwód</th>
          <th>Dzielnica / Osiedle</th>
          <th>Oddział</th>
          <th>Pow. (ha)</th>
          <th>STL</th>
          <th>Gatunek panujący</th>
          <th>Wiek (lata)</th>
          <th>Plan</th>
          <th>WGS84</th>
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <EmptyRow colSpan="9" />
        ) : (
          records.map((record, idx) => (
            <tr key={idx}>
              <td>
                <div className="species-cell">{record.forestArea}</div>
              </td>
              <td>
                <div>{record.district}</div>
                <small className="address-cell">{record.settlement}</small>
              </td>
              <td>
                {record.divisionNo}
                {record.subDivision !== "-" ? `/${record.subDivision}` : ""}
              </td>
              <td>{record.area}</td>
              <td>{record.habitatType}</td>
              <td>{record.dominantSpecies}</td>
              <td>{record.ageYears}</td>
              <td>{record.planValidity}</td>
              <Coords record={record} />
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function PlantTable({ records }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Gatunek</th>
          <th>Lokalizacja / Adres</th>
          <th>Wys. (m)</th>
          <th>Obwód (cm)</th>
          <th>Korona (m)</th>
          <th>Stan</th>
          <th>Wiek (dni)</th>
          <th>Data pomiaru</th>
          <th>Nr inw.</th>
          <th>WGS84</th>
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <EmptyRow colSpan="10" />
        ) : (
          records.map((record, idx) => (
            <tr key={idx}>
              <td>
                <div className="species-cell">
                  {record.species} {record.outlineId !== "-" ? `(G: ${record.outlineId})` : ""}
                </div>
                <small className="latin-cell">{record.speciesLatin !== "-" ? record.speciesLatin : ""}</small>
              </td>
              <td>
                <div>{record.district}</div>
                <small className="address-cell">
                  {record.address} {record.addressNumber !== "-" ? record.addressNumber : ""}
                </small>
                {record.location !== "-" && <div className="location-cell">({record.location})</div>}
              </td>
              <td>{record.height}</td>
              <td>{record.circumference}</td>
              <td>{record.crownDiameter}</td>
              <td>{record.health}</td>
              <td>{record.ageDays}</td>
              <td>{record.measurementDate}</td>
              <td>{record.inventoryNumber}</td>
              <Coords record={record} />
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default function ResultsTable({ records, view }) {
  return view === "FORESTS" ? <ForestTable records={records} /> : <PlantTable records={records} />;
}
