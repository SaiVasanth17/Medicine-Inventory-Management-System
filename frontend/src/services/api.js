import axios from "axios";

export default axios.create({
  baseURL: "https://medicine-inventory-management-system.onrender.com/api",
});