const eventService = require('../services/eventService');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const items = await eventService.findAll();
  res.json(items);
});

const getById = asyncHandler(async (req, res) => {
  const item = await eventService.findById(req.params.id);
  if (!item) {
    const err = new Error('Event not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(item);
});

const create = asyncHandler(async (req, res) => {
  const item = await eventService.create(req.body);
  res.status(201).json(item);
});

const update = asyncHandler(async (req, res) => {
  const item = await eventService.update(req.params.id, req.body);
  res.json(item);
});

const remove = asyncHandler(async (req, res) => {
  await eventService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getById, create, update, remove };
