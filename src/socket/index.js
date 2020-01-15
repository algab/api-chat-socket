const conversation = require('../api/models/conversation.model');

module.exports = (socket) => {
    async function aggregate(idUser, match) {
        const data = await conversation.aggregate([
            { $match: { users: { $all: match } } },
            { $sort: { updatedAt: -1 } },
            { $unwind: '$users' },
            { $match: { users: { $ne: idUser } } },
            { $project: { users: { $toObjectId: '$users' }, last_message: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $project: { user: 1, last_message: 1 } },
        ]);
        return data;
    }

    socket.on('connection', (io) => {
        io.on('message', async (data) => {
            const result = await conversation.findById(data.conversation);
            await conversation.updateOne(
                { _id: result.id },
                { $push: { messages: data.message }, last_message: data.message },
            );
            socket.emit(`${result.users[0]}-last-messages`, await aggregate(result.users[0], [result.users[0]]));
            socket.emit(`${result.users[1]}-last-messages`, await aggregate(result.users[1], [result.users[1]]));
            io.to(`${data.conversation}`).emit('new message', data.message);
        });
        io.on('room', async (room) => {
            await io.join(room);
        });
    });
};
