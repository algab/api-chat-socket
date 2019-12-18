const router = require('express').Router();
const model = require('../../models/user.model');
const user = require('./controllers/user.controller');
const validate = require('../../middlewares/validate.middleware');

router.post('/', validate(model), user.save);
router.get('/', user.list);
router.get('/:id', user.search);
router.put('/login', user.login);
router.put('/:id', validate(model), user.update);

module.exports = router;
