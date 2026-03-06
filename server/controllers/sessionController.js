const sessionService = require('../services/sessionService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await sessionService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await sessionService.findById(req.params.id);
  if (!item) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await sessionService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await sessionService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await sessionService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, create, update, remove };
