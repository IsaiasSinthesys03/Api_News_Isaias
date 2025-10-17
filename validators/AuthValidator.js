// validators/AuthValidator.js
const { check } = require('express-validator');
const { User } = require('../models/UserModel');

const validatorLogin = [
    check('email').notEmpty().withMessage('El campo email es requerido')
        .isEmail().withMessage('El campo email debe ser un correo válido'),

    check('password').notEmpty().withMessage('El campo password es requerido')
];

const validatorRegister = [
    check('nick').notEmpty().withMessage('El campo nick es obligatorio')
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo nick debe tener entre 2 y 20 caracteres'),

    check('email').notEmpty().withMessage('El campo email es obligatorio')
        .isEmail().withMessage('El campo email debe ser un correo válido')
        .isLength({ min: 2, max: 255 }).withMessage('El campo email debe tener entre 2 y 255 caracteres')
        .custom((value) => {
            return User.findOne({ where: { email: value } })
                .then((user) => {
                    if (user) {
                        throw new Error('Ya existe un usuario con este email')
                    }
                })
        }),

    check('password').notEmpty().withMessage('El campo password es obligatorio')
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8, max: 255 }).withMessage('El campo password debe tener entre 8 y 255 caracteres'),
];

module.exports = {
    validatorLogin,
    validatorRegister
};


