'user string'

const jwt = require('jsonwebtoken');


exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, {
        expiresIn: '1d'
    });
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

exports.authorize = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Accesso Restringido'
        })
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                res.status(401).send({
                    message: 'Token Invalido'
                });
            } else {
                next();
            }
        })
    }

}

exports.isAdmin = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Accesso Restringido'
        })
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                res.status(401).send({
                    message: 'Token Invalido'
                });
            } else {
                console.log(decoded.roles);
                if (decoded.roles.includes('admin')) {
                    next();
                } else {
                    res.status(403).send({
                        message: "Funcionalidad restringida para administradores"
                    });
                }
            }
        })
    }

}
