const conversation = require('../../../models/conversation.model');

class Conversation {
    constructor() {
        this.Conversation = conversation;
        this.save = this.save.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async save({ body }, res) {
        try {
            const find = await this.Conversation.find({ users: body.users });
            if (find.length > 0) {
                res.status(409).json({ Message: 'Conversation conflict' }).end();
            } else {
                await new this.Conversation(body).save();
                res.status(201).json({ Message: 'Conversation save successful' }).end();
            }
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async deleteUser({ params }, res) {
        try {
            await this.Conversation.updateOne(
                { _id: params.idConversation },
                { $pull: { users: params.idUser } },
            );
            res.status(200).json({ Message: 'User removed from conversation' }).end();
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }
}

module.exports = new Conversation();
