const express = require('express');
const { getAll, getById, getUpcoming, create, update, remove } = require('../controllers/matchController');

const router = express.Router();
router.get('/upcoming', getUpcoming);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
module.exports = router;
