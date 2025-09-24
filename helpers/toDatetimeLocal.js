module.exports = isoString => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
}