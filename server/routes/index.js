"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const bcryptjs_1 = require("bcryptjs");
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("../constants");
const index_1 = require("../models/index");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/register', (0, express_validator_1.body)('password').isLength({ min: 6 }), (async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        const { username, password } = req.body;
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Длина пароля должна быть от 6 символов',
            });
        }
        const existingUser = await index_1.UserDataModel.findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Пользователь с таким ником уже существует' });
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 6);
        const user = new index_1.UserDataModel({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Вы зарегистрированы' });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
}));
router.post('/login', (0, express_validator_1.body)('password').isLength({ min: 6 }), (async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Длина пароля должна быть больше 5 символов',
            });
        }
        const { username, password } = req.body;
        const user = await index_1.UserDataModel.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Нет пользователя с таким ником' });
        }
        const isMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({ userId: user.id }, constants_1.jwtAccessSecretKey, { expiresIn: '5d' });
        res
            .status(200)
            .json({
            message: 'Вы вошли в аккаунт',
            token: accessToken,
            userId: user.id,
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
}));
router.get('/auth', authMiddleware_1.verifyToken, async (req, res) => {
    try {
        res.set('Content-Type', 'application/json');
        const user = await index_1.UserDataModel.findOne({ _id: req.user.userId });
        if (!user) {
            return res.status(400).json({ message: 'Не удалось авторизоваться' });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({ userId: user.id }, constants_1.jwtAccessSecretKey, { expiresIn: '5d' });
        res
            .status(200)
            .json({
            message: 'Вы вошли в аккаунт',
            token: accessToken,
            userId: user.id,
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});
//# sourceMappingURL=index.js.map