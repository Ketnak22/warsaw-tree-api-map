import { Popup } from "react-leaflet";

export default function RecordPopup({ record }) {
  return (
    <Popup>
      {record.type === "FORESTS" ? (
        <>
          <div className="popup-title">{record.forestArea}</div>
          <div className="popup-meta">
            <strong>Dzielnica:</strong> {record.district}
            <br />
            <strong>Osiedle:</strong> {record.settlement}
            <br />
            <strong>Oddział:</strong> {record.divisionNo}
            {record.subDivision !== "-" ? ` / ${record.subDivision}` : ""}
            <br />
            <hr />
            <strong>Gatunek panujący:</strong> {record.dominantSpecies}
            <br />
            <strong>Wiek:</strong> {record.ageYears} {record.ageYears !== "-" ? "lat" : ""}
            <br />
            <strong>Typ siedliskowy:</strong> {record.habitatType}
            <br />
            <small>Plan: {record.planValidity}</small>
          </div>
        </>
      ) : (
        <>
          <div className="popup-title">
            {record.species}
            {record.speciesLatin !== "-" && (
              <span className="popup-latin"> ({record.speciesLatin})</span>
            )}
            {record.outlineId !== "-" ? ` (Grupa: ${record.outlineId})` : ""}
          </div>
          <div className="popup-meta">
            <strong>Dzielnica:</strong> {record.district}
            <br />
            <strong>Adres:</strong> {record.address}{" "}
            {record.addressNumber !== "-" ? record.addressNumber : ""}
            <br />
            {record.location !== "-" && (
              <>
                <strong>Lokalizacja:</strong> {record.location}
                <br />
              </>
            )}
            <hr />
            <strong>Wysokość:</strong> {record.height} {record.height !== "-" ? "m" : ""}
            <br />
            <strong>Obwód pnia:</strong> {record.circumference}{" "}
            {record.circumference !== "-" ? "cm" : ""}
            <br />
            <strong>Średnica korony:</strong> {record.crownDiameter}{" "}
            {record.crownDiameter !== "-" ? "m" : ""}
            <br />
            <strong>Stan:</strong> {record.health}
            <br />
            <strong>Wiek:</strong> {record.ageDays} {record.ageDays !== "-" ? "dni" : ""}
            <br />
            <small>Data pomiaru: {record.measurementDate}</small>
            <small>Nr inw: {record.inventoryNumber}</small>
          </div>
        </>
      )}
    </Popup>
  );
}
