import { useEffect, useState } from "react";
import { loadSessions } from "../services/session.service";

export default function HistoryPanel() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadSessions();
      setSessions(data);
    }

    fetchData();
  }, []);

  return (
    <div className="history">
      <h2>Calculation History</h2>

      {sessions.map(s => (
        <div key={s.id} className="history-card">
          <p><b>Messages:</b> {s.inputs.messages}</p>
          <p><b>Model:</b> {s.inputs.model}</p>
          <p><b>Monthly Cost:</b> ${s.result.total}</p>
        </div>
      ))}
    </div>
  );
}