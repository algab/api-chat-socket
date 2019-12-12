const router = require('express').Router();
const model = require('../../models/conversation.model');
const conversation = require('./controllers/conversation.controller');
const validate = require('../../middlewares/validate.middleware');

router.post('/', validate(model), conversation.save);
router.delete('/:idConversation/users/:idUser', conversation.deleteUser);

module.exports = router;
