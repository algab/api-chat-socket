const conversation = require('../../../models/conversation.model');

class Conversation {
    constructor() {
        this.Conversation = conversation;
        this.save = this.save.bind(this);
        this.search = this.search.bind(this);
        this.user = this.user.bind(this);
        this.message = this.message.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async save({ body }, res) {
        try {
            const find = await this.Conversation.find({ users: body.users });
            if (find.length > 0) {
                res.status(409).json({ Message: 'Conversation conflict' }).end();
            } else {
                const data = body;
                data.last_message = null;
                await new this.Conversation(data).save();
                res.status(201).json({ Message: 'Conversation save successful' }).end();
            }
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async search({ params }, res) {
        try {
            const data = await this.Conversation.findById(params.id, { users: 0 });
            res.status(200).json(data).end();
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async user({ params }, res) {
        try {
            const data = await this.Conversation.aggregate([
                { $match: { users: params.idUser } },
                { $unwind: '$users' },
                { $match: { users: { $ne: params.idUser } } },
                { $project: { users: { $toObjectId: '$users' } } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'users',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $project: { user: 1 } },
            ]);
            res.status(200).json(data).end();
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async message({ params, body }, res) {
        try {
            await this.Conversation.updateOne(
                { _id: params.id },
                { $push: { messages: body }, last_message: body },
            );
            res.status(200).json({ Message: 'Message added to conversation' }).end();
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
