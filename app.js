require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Подключаем маршруты пользователя
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // Добавляем маршруты пользователя

const port = process.env.PORT || 3000;

// Создание таблиц и запуск сервера
sequelize.sync({ force: true }) // ВНИМАНИЕ: Перезагрузка таблиц, если они уже существуют
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to sync database:', err);
    });
