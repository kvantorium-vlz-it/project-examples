# telegram-bot

Данный проект показывает, как можно работать с библиотекой [**telegraf.js**](https://telegraf.js.org/)

Весь код написан на [**typescript**](https://www.typescriptlang.org/) для простой работы в редакторе кода. Весь код можно переписать на javascript.

## Структура проекта

Весь пример находится в файле [**index.ts**](./src/index.ts).

В нем продемонстрированы следующие примеры:

1. Как создать бота.
2. Создание команд.
3. Создание кнопок.
4. Интеграция с бд, используя [**prisma ORM**](https://www.prisma.io/).
5. Опрос от бота(quiz).
6. Создание динамических кнопок.

## Запуск

1. Скопировать .env.example файл в .env
2. Установть свои значения переменных в .env
3. Установить зависимости
```sh
npm install
```
4. Проинициализировать призму
```sh
npx prisma db push && npx prisma generate
```
5. Запустить код:
```sh
npm run dev
```
6. (Опционально) Запустить интерфейс в браузере для легкого управления контентом в бд:
```sh
npx prisma studio
```
