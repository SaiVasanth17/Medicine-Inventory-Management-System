import api from "../services/api";
import "./MedicineList.css";

function MedicineList({ medicines, onEdit, onDelete }) {
  const deleteMedicine = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/medicines/${id}`);

      alert(res.data.message);

      onDelete();
    } catch (err) {
      alert(err.response?.data?.message || "Delete Failed");
    }
  };

  return (
    <div className="medicine-list">
      <h2>Medicine List</h2>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Brand Name</th>
            <th>Strength</th>
            <th>Pack</th>
            <th>SKU</th>
            <th>MRP (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medicines.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Medicines Found
              </td>
            </tr>
          ) : (
            medicines.map((medicine, index) => (
              <tr key={medicine.id}>
                <td>{index + 1}</td>
                <td>{medicine.brand_name}</td>
                <td>{medicine.strength}</td>
                <td>{medicine.pack}</td>
                <td>{medicine.sku}</td>
                <td>₹ {Number(medicine.mrp).toFixed(2)}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(medicine)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteMedicine(medicine.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineList;