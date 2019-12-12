module.exports = (model) => ({ body }, res, next) => {
    const validate = model(body).validateSync();
    if (validate) {
        res.status(400).json({ Message: validate.message }).end();
    } else {
        next();
    }
};
