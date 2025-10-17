// controllers/AuthController.js (Versión Final con JWT)
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
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
        attributes: ['id', 'perfil_id', 'username', 'email']
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

const register = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.mapped() });
        }

        const perfil_id = request.body.perfil_id || 2;
        // Verificar si el perfil existe, si no, crearlo
        let perfil = await Profile.findByPk(perfil_id);
        if (!perfil) {
            try {
                perfil = await Profile.create({ id: perfil_id, nombre: 'Contribuidor' });
            } catch (e) {
                // Si el perfil ya existe por race condition, lo ignoramos
            }
        }

        // Mapeo estricto de campos
        const userData = {
            username: request.body.nick,
            email: request.body.email,
            password: request.body.password,
            perfil_id: perfil_id,
            activo: true
        };

        // Validación extra: nick, email y password deben existir
        if (!userData.username || !userData.email || !userData.password) {
            return response.status(422).json({ error: 'Faltan campos obligatorios: nick, email o password' });
        }

        const nuevoUsuario = await User.create(userData);
        return response.status(201).json(nuevoUsuario);
    } catch (err) {
        console.error('Error detallado al crear usuario:', err);
        return response.status(500).json({ error: 'Error al crear el usuario', detalle: err.message });
    }
};

module.exports = {
    login,
    register,
};


//tamalitos