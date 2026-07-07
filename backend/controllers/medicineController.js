const pool = require("../config/db");

const generateSKU = require("../utils/skuGenerator");

const addMedicine = async (req, res) => {
  try {
    const { brand_name, strength, pack, mrp } = req.body;

    // Validation
    if (!brand_name || !strength || !pack || !mrp) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    if (Number(mrp) <= 0) {
      return res.status(400).json({
        success: false,
        message: "MRP must be greater than zero",
      });
    }

    const sku = generateSKU(brand_name, strength, pack);

    // Check duplicate SKU
    const existing = await pool.query(
      "SELECT * FROM medicines WHERE sku=$1",
      [sku]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO medicines
      (brand_name,strength,pack,sku,mrp)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [brand_name, strength, pack, sku, mrp]
    );

    res.status(201).json({
      success: true,
      message: "Medicine Added Successfully",
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Temporary placeholders
const getMedicines = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medicines ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const searchMedicine = async (req, res) => {
  try {
    const search = req.query.search || "";

    const result = await pool.query(
      `SELECT *
       FROM medicines
       WHERE sku ILIKE $1
       ORDER BY id ASC`,
      [`%${search}%`]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand_name, strength, pack, mrp } = req.body;

    // Validation
    if (!brand_name || !strength || !pack || !mrp) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    if (Number(mrp) <= 0) {
      return res.status(400).json({
        success: false,
        message: "MRP must be greater than zero",
      });
    }

    // Generate new SKU
    const sku = generateSKU(brand_name, strength, pack);

    // Check if another medicine already has this SKU
    const duplicate = await pool.query(
      "SELECT * FROM medicines WHERE sku = $1 AND id <> $2",
      [sku, id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists",
      });
    }

    // Update record
    const result = await pool.query(
      `UPDATE medicines
       SET brand_name=$1,
           strength=$2,
           pack=$3,
           sku=$4,
           mrp=$5
       WHERE id=$6
       RETURNING *`,
      [brand_name, strength, pack, sku, mrp, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine Updated Successfully",
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM medicines WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine Deleted Successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  searchMedicine,
  updateMedicine,
  deleteMedicine,
};