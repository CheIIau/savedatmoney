import { hash, compare } from 'bcryptjs';
import { Router, Request, Response, RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';
import { jwtAccessSecretKey } from '../constants';
import { UserDataModel } from '../models/index';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

interface requestRegisterBody {
  username: string;
  password: string;
}

router.post('/register', body('password').isLength({ min: 6 }), (async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { username, password } = req.body as requestRegisterBody;
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Длина пароля должна быть от 6 символов',
      });
    }

    const existingUser = await UserDataModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким ником уже существует' });
    }
    const hashedPassword = await hash(password, 6);
    const user = new UserDataModel({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'Вы зарегистрированы' });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
}) as RequestHandler);

router.post('/login', body('password').isLength({ min: 6 }), (async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Длина пароля должна быть больше 5 символов',
      });
    }
    const { username, password } = req.body as requestRegisterBody;
    const user = await UserDataModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Нет пользователя с таким ником' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const accessToken = sign({ userId: user.id as string }, jwtAccessSecretKey, { expiresIn: '5d' });

    res.status(200).json({ message: 'Вы вошли в аккаунт', token: accessToken, userId: user.id as string });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
}) as RequestHandler);

router.get('/auth', verifyToken, async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', 'application/json');
    const user = await UserDataModel.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: 'Не удалось авторизоваться' });
    }
    const accessToken = sign({ userId: user.id as string }, jwtAccessSecretKey, { expiresIn: '5d' });
    res.status(200).json({ message: 'Вы вошли в аккаунт', token: accessToken, userId: user.id as string });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

export { router };
