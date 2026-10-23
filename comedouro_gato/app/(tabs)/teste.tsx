import { useState } from "react";

export default function SeletorHora() {
  const [hora, setHora] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <label htmlFor="relogio" style={{ display: "block", marginBottom: "8px" }}>
        Clique no campo para selecionar a hora:
      </label>
      
      <input
        id="relogio"
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      />

      {hora && <p style={{ marginTop: "15px" }}>Hora selecionada: {hora}</p>}
    </div>
  );
}

