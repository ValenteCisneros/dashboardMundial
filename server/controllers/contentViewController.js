const contentViewService = require('../services/contentViewService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await contentViewService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await contentViewService.findById(req.params.id);
  if (!item) {
    const err = new Error('ContentView not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await contentViewService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await contentViewService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await contentViewService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, create, update, remove };
