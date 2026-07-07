const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicineController");

router.post("/", medicineController.addMedicine);
router.get("/", medicineController.getMedicines);
router.get("/search", medicineController.searchMedicine);
router.put("/:id", medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);

module.exports = router;