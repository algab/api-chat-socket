const router = require('express').Router();
const user = require('./controllers/user.controller');

router.post('/', user.save);
router.get('/', user.list);
router.get('/:id', user.search);
router.put('/:id', user.update);

module.exports = router;
