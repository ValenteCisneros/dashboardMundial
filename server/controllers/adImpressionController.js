const adImpressionService = require('../services/adImpressionService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await adImpressionService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await adImpressionService.findById(req.params.id);
  if (!item) {
    const err = new Error('AdImpression not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await adImpressionService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await adImpressionService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await adImpressionService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, create, update, remove };
