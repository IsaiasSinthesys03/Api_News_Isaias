const { check } = require('express-validator');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

const validatorUserCreate = [
    check('username').notEmpty().withMessage('El campo username es obligatorio')
        .isString().withMessage('El campo username debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres')
        .custom((value) => {
            return User.findOne({ where: { username: value } })
                .then((user) => {
                    if (user) {
                        throw new Error('Ya existe un usuario con el mismo username');
                    }
                });
        }),

    check('email').notEmpty().withMessage('El campo email es obligatorio')
        .isEmail().withMessage('Debe ser un correo valido')
        .custom((value) => {
            return User.findOne({ where: { email: value } })
                .then((user) => {
                    if (user) {
                        throw new Error('Ya existe un usuario con el mismo email');
                    }
                });
        }),

    check('password').notEmpty().withMessage('El campo password es obligatorio')
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),

    check('perfil_id').notEmpty().withMessage('El campo perfil id es obligatorio')
        .isInt().withMessage('El campo perfil id debe ser numero')
        .custom((value) => {
            return Profile.findOne({ where: { id: value } })
                .then((profile) => {
                    if (!profile) {
                        throw new Error('No existe un perfil con ese id');
                    }
                });
        }),
];

const validatorUserUpdate = [
    check('username').optional()
        .isString().withMessage('El campo username debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('email').optional()
        .isEmail().withMessage('Debe ser un correo valido'),

    check('password').optional()
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),

    check('perfil_id').optional()
        .isInt().withMessage('El campo perfil id debe ser numero')
        .custom((value) => {
            return Profile.findOne({ where: { id: value } })
                .then((profile) => {
                    if (!profile) {
                        throw new Error('No existe un perfil con ese id');
                    }
                });
        }),
];

module.exports = {
    validatorUserCreate,
    validatorUserUpdate
}