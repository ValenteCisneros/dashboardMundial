const placeService = require('../services/placeService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await placeService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await placeService.findById(req.params.id);
  if (!item) {
    const err = new Error('Place not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const getNearby = asyncHandler(async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
  const sponsorsFirst = req.query.sponsorsFirst !== 'false';
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    const err = new Error('lat and lng required');
    err.statusCode = 400;
    throw err;
  }
  const items = await placeService.findNearby({ lat, lng, limit, sponsorsFirst });
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const item = await placeService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await placeService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await placeService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, getNearby, create, update, remove };
