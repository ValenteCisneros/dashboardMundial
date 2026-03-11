const express = require('express');
const { getAll, getById, getNearby, create, update, remove } = require('../controllers/placeController');

const router = express.Router();
router.get('/nearby', getNearby);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
module.exports = router;
