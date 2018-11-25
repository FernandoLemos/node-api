'use strinc'

const repo = require('../repositories/order-repositories');
const guid = require('guid');
const authService = require('../services/aut-services')
exports.get = async (req, res, next) => {
    try {
        var data = await repo.get()
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Server Error",
            data: e
        })
    }
}

exports.post = async (req, res, next) => {
    try {
        const token = req.body.token || req.body.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repo.create({
            customer: data._id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        res.status(200).send({
            message: 'Customer registrado con exito'

        });
    } catch (e) {
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
};