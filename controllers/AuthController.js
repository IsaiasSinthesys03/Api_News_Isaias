// controllers/AuthController.js (Versión Final con JWT)
const { User } = require('../models/UserModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const login = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }
    User.findOne({
        where: {
            email: request.body.email,
            password: request.body.password,
            activo: true
        },
        attributes: ['id', 'perfil_id', 'nombre', 'apellidos', 'nick']
    }).then(usuario => {
        if (usuario) {
            const token = jwt.sign({ usuario }, 'mi_llave_secreta', { expiresIn: '24h' });
            response.status(200).json({ message: "Login con éxito", token: token });
        }
        else {
            response.status(401).json({ message: "Sin autorización" });
        }
    })
        .catch(err => {
            response.status(500).send('Error al consultar el dato');
        });
};

const register = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    // Construir objeto alineado al modelo User
    const userData = {
        username: request.body.nick, // Mapeo correcto
        email: request.body.email,
        password: request.body.password,
        perfil_id: 2,
        activo: true
    };

    User.create(userData)
        .then(newEntitie => {
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            // Mejor log para depuración
            console.error('Error detallado al crear usuario:', err);
            response.status(500).send('Error al crear el usuario');
        });
};

module.exports = {
    login,
    register,
};


