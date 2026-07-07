const generateSKU = (brand, strength, pack) => {
  return `${brand} ${strength} ${pack}`
    .replace(/\s+/g, " ")
    .trim();
};

module.exports = generateSKU;