const matchService = require('../services/matchService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await matchService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await matchService.findById(req.params.id);
  if (!item) {
    const err = new Error('Match not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const getUpcoming = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 30);
  const items = await matchService.findUpcoming(limit);
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const item = await matchService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await matchService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await matchService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, getUpcoming, create, update, remove };
