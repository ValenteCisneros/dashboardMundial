const adService = require('../services/adService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await adService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await adService.findById(req.params.id);
  if (!item) {
    const err = new Error('Ad not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await adService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await adService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await adService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, create, update, remove };
