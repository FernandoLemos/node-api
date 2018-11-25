'use strinc'
const Validator = require('../validators/fluent-validators');
const repo = require('../repositories/customer-repositores');
const md5 = require('md5');
var emailService = require('../services/emails-services');
const authService = require('../services/aut-services');


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
    let contract = new Validator();

    contract.hasMinLen(req.body.name, 3, "El titulo debe contener al menos 3 caracteres");
    //contract.isEmail(req.body.email, "Formato incorrecto de emails");
    contract.hasMinLen(req.body.password, 3, "El titulo debe contener al menos 3 caracteres");

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
    }
    try {
        await repo.create({
            name: req.body.name,
            emails: req.body.emails,
            password: md5(req.body.password + global.SALT_KEY),
            roles:['user']
        })
        emailService.send(req.body.emails, "Bienvenidos a node store",
            global.EMAIL_TMPL.replace('{0}', req.body.name));
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

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repo.authenticate({
            emails: req.body.emails,
            password: md5(req.body.password + global.SALT_KEY)
        })
        // emailService.send(req.body.emails, "Bienvenidos a node store",
        //     global.EMAIL_TMPL.replace('{0}', req.body.name));

        if (customer) {
            const token = await authService.generateToken({
                id:customer._id,
                email: customer.email,
                name: customer.name,
                roles:customer.roles
            });
            res.status(201).send({
                token: token,
                data: {
                    name: customer.emails,
                    password: customer.password
                }
            });
        } else {
            res.status(401).send({
                message: "Unauthorized"
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.body.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repo.getById(data.id);

        // emailService.send(req.body.emails, "Bienvenidos a node store",
        //     global.EMAIL_TMPL.replace('{0}', req.body.name));

        if (customer) {
            const tokenData = await authService.generateToken({
                id:customer._id,
                email: customer.email,
                name: customer.name,
                roles:customer.roles
            });
            res.status(201).send({
                token: token,
                data: {
                    name: customer.emails,
                    password: customer.password
                }
            });
        } else {
            res.status(401).send({
                message: "El cliente no pudo ser encontrado"
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
};

