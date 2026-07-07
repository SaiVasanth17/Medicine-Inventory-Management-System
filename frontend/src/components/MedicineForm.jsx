import { useState, useEffect } from "react";
import api from "../services/api";
import "./MedicineForm.css";

function MedicineForm({editingMedicine,setEditingMedicine,onMedicineAdded,setMessage,setMessageType,}) {
  const [medicine, setMedicine] = useState({
    brand_name: "",
    strength: "",
    pack: "",
    sku: "",
    mrp: "",
  });

  useEffect(() => {
    if (editingMedicine) {
        setMedicine({
        id: editingMedicine.id,
        brand_name: editingMedicine.brand_name,
        strength: editingMedicine.strength,
        pack: editingMedicine.pack,
        sku: editingMedicine.sku,
        mrp: editingMedicine.mrp,
        });
    }
    }, [editingMedicine]);

  const generateSKU = (brand, strength, pack) => {
    return `${brand} ${strength} ${pack}`
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const cleanedValue = value.replace(/\s+/g, " ");

    const updatedMedicine = {
      ...medicine,
      [name]: cleanedValue,
    };

    updatedMedicine.sku =
      updatedMedicine.brand_name &&
      updatedMedicine.strength &&
      updatedMedicine.pack
        ? generateSKU(
            updatedMedicine.brand_name,
            updatedMedicine.strength,
            updatedMedicine.pack
          )
        : "";

    setMedicine(updatedMedicine);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const medicineData = {
        brand_name: medicine.brand_name.trim(),
        strength: medicine.strength.trim(),
        pack: medicine.pack.trim(),
        mrp: medicine.mrp,
        };

        if (editingMedicine) {
        const response = await api.put(
            `/medicines/${editingMedicine.id}`,
            medicineData
        );

        setMessage(response.data.message);
        setMessageType("success");

        setEditingMedicine(null);
        } else {
        const response = await api.post(
            "/medicines",
            medicineData
        );

        setMessage(response.data.message);
        setMessageType("success");
        }

        onMedicineAdded();

        setMedicine({
        brand_name: "",
        strength: "",
        pack: "",
        sku: "",
        mrp: "",
        });

    } catch (err) {
        setMessage(err.response?.data?.message || "Something went wrong");
        setMessageType("error");
    }
    };

  return (
    <form className="medicine-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Brand Name *</label>
        <input
          type="text"
          name="brand_name"
          placeholder="Enter Brand Name"
          value={medicine.brand_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Strength *</label>
        <input
          type="text"
          name="strength"
          placeholder="Example: 500mg"
          value={medicine.strength}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Pack *</label>
        <input
          type="text"
          name="pack"
          placeholder="Example: Tablet 10s"
          value={medicine.pack}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>SKU</label>
        <input
          type="text"
          value={medicine.sku}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>MRP (₹) *</label>
        <input
          type="number"
          name="mrp"
          placeholder="Enter MRP"
          min="0.01"
          step="0.01"
          value={medicine.mrp}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={
            !medicine.brand_name ||
            !medicine.strength ||
            !medicine.pack ||
            !medicine.mrp
        }
        >
        {editingMedicine ? "Update Medicine" : "Add Medicine"}
      </button>
      {editingMedicine && (
        <button
            type="button"
            className="cancel-btn"
            onClick={() => {
            setEditingMedicine(null);

            setMedicine({
                brand_name: "",
                strength: "",
                pack: "",
                sku: "",
                mrp: "",
            });
            }}
        >
            Cancel
        </button>
        )}
    </form>
  );
}

export default MedicineForm;