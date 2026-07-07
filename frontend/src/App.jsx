import { useEffect, useState } from "react";
import "./App.css";
import api from "./services/api";

import MedicineForm from "./components/MedicineForm";
import SearchBar from "./components/SearchBar";
import MedicineList from "./components/MedicineList";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchMedicine = async (keyword) => {
    try {
      if (keyword.trim() === "") {
        fetchMedicines();
        return;
      }

      const res = await api.get(
        `/medicines/search?search=${encodeURIComponent(keyword)}`
      );

      setMedicines(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="container">
      <h1>Medicine Inventory Management System</h1>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <MedicineForm
        editingMedicine={editingMedicine}
        setEditingMedicine={setEditingMedicine}
        onMedicineAdded={fetchMedicines}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />

      <SearchBar onSearch={searchMedicine} />

      <MedicineList
        medicines={medicines}
        onEdit={setEditingMedicine}
        onDelete={fetchMedicines}
      />
    </div>
  );
}

export default App;