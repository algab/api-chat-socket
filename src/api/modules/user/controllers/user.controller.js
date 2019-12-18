const hasha = require('hasha');

const user = require('../../../models/user.model');

class UserController {
    constructor() {
        this.User = user;
        this.save = this.save.bind(this);
        this.list = this.list.bind(this);
        this.search = this.search.bind(this);
        this.login = this.login.bind(this);
        this.update = this.update.bind(this);
    }

    async save({ body }, res) {
        try {
            const data = body;
            const result = await this.User.find({ email: data.email }).countDocuments();
            if (!result) {
                data.avatar_url = `https://www.gravatar.com/avatar/${hasha(data.email, { algorithm: 'md5' })}?d=retro`;
                const newUser = await new this.User(data).save();
                res.status(201).json(newUser).end();
            } else {
                res.status(409).json({ Message: 'Email conflict' }).end();
            }
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async list(req, res) {
        try {
            const users = await this.User.find();
            res.status(200).json(users).end();
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async search({ params }, res) {
        try {
            const data = await this.User.findById(params.id);
            res.status(200).json(data).end();
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async login({ body }, res) {
        try {
            if (body.email && body.password) {
                const { email, password } = body;
                const data = await this.User.findOne({ email, password });
                if (data) {
                    res.status(200).json(data).end();
                } else {
                    res.status(404).json({ Message: 'User not found' }).end();
                }
            } else {
                res.status(400).json({ Message: 'E-mail and password is required ' }).end();
            }
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }

    async update({ body, params }, res) {
        try {
            const result = await this.User.findById(params.id);
            if (result) {
                const data = body;
                if (data.email === result.email) {
                    await this.User.updateOne({ _id: params.id }, { $set: data });
                    res.status(200).json({ Message: 'User updated' }).end();
                } else {
                    const total = await this.User.find({ email: data.email }).countDocuments();
                    if (!total) {
                        data.avatar_url = `https://www.gravatar.com/avatar/${hasha(data.email, { algorithm: 'md5' })}?d=retro`;
                        await this.User.updateOne({ _id: params.id }, { $set: data });
                        res.status(200).json({ Message: 'User updated' }).end();
                    } else {
                        res.status(409).json({ Message: 'Email conflict' }).end();
                    }
                }
            } else {
                res.status(404).json({ Message: 'User not found' }).end();
            }
        } catch (error) {
            res.status(500).json({ Message: 'Server Error' }).end();
        }
    }
}

module.exports = new UserController();
