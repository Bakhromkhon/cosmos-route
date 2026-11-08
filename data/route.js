// Встроенная копия data/route.json.
// Нужна, чтобы маршрут открывался и без локального сервера (file://),
// когда браузер блокирует fetch локальных файлов.
// Файл сгенерирован из data/route.json — при изменении маршрута обновите оба файла.
window.ROUTE_DATA = {
  "object": {
    "id": "cosmos-pribaltiyskaya",
    "type": "Отель",
    "name": "Космос Прибалтийская",
    "destinationType": "Ресторан",
    "destinationName": "Шведская Линия",
    "estimatedMinutes": "5–7 минут",
    "supervisor": {
      "label": "Супервайзер",
      "numbers": [
        "2753",
        "2747"
      ]
    }
  },
  "steps": [
    {
      "badge": "1",
      "icon": "facade",
      "shortTitle": "Фасад",
      "title": "Подойдите к фасаду отеля",
      "description": "Старт у фасада COSMOS.",
      "action": "Идите к входу для персонала.",
      "context": "Старт маршрута",
      "image": "./assets/images/step-1-fasad-v2.jpg",
      "alt": "Фасад отеля",
      "details": [
        "Ориентир: центральный фасад COSMOS.",
        "Не заходите через вход для гостей."
      ]
    },
    {
      "badge": "2",
      "icon": "door",
      "shortTitle": "Вход",
      "title": "Зайдите в служебную дверь",
      "description": "Ищите вход STAFF ONLY.",
      "action": "Откройте дверь и заходите.",
      "context": "Вход в здание",
      "image": "./assets/images/step-2-vhod-v2.jpg",
      "alt": "Служебный вход",
      "details": [
        "Если рядом поток гостей, вы идёте не туда.",
        "Ориентируйтесь на служебную дверь."
      ]
    },
    {
      "badge": "3",
      "icon": "security",
      "shortTitle": "Охрана",
      "title": "Подойдите к охране",
      "description": "Возьмите ключ от шкафчика.",
      "action": "Подойдите к охране и представьтесь.",
      "context": "Проверка на входе",
      "image": "./assets/images/step-3-ohrana-v2.jpg",
      "alt": "Охрана и турникеты",
      "script": "Здравствуйте! Я официант из компании АКМЭ. Приехал на смену в ресторан Шведская Линия. Мне нужен ключ от шкафчика.",
      "details": [
        "Охрана слева.",
        "Возьмите ключ от шкафчика."
      ]
    },
    {
      "badge": "4",
      "icon": "locker",
      "shortTitle": "Шкафчик",
      "title": "Найдите свой шкафчик",
      "description": "Оставьте вещи в шкафчике.",
      "action": "Найдите шкафчик и уберите вещи.",
      "context": "Подготовка",
      "image": "./assets/images/step-4-shkafchik-v2.jpg",
      "alt": "Шкафчики",
      "details": [
        "Шкафчики справа.",
        "Личные вещи в зал не брать."
      ]
    },
    {
      "badge": "5-6",
      "icon": "changing",
      "shortTitle": "Раздевалки",
      "title": "Идите к своей раздевалке",
      "description": "Проход к раздевалкам по коридору.",
      "action": "Идите до своей раздевалки.",
      "context": "Переодевание",
      "image": "./assets/images/step-5-6-razdevalki-v2.jpg",
      "alt": "Раздевалки и коридор",
      "details": [
        "Мужская справа.",
        "Женская слева.",
        "Потом вернитесь в холл."
      ]
    },
    {
      "badge": "7",
      "icon": "corridor",
      "shortTitle": "Коридор",
      "title": "Идите по зелёному коридору",
      "description": "Здесь без поворотов.",
      "action": "Идите прямо по зелёному коридору.",
      "context": "Длинный проход",
      "image": "./assets/images/step-7-koridor-v2.jpg",
      "alt": "Зелёный коридор",
      "details": [
        "Идите только прямо.",
        "Не сворачивайте."
      ]
    },
    {
      "badge": "8",
      "icon": "split",
      "shortTitle": "Прачечная",
      "title": "Держитесь правой стороны",
      "description": "Прачечная слева, лифт справа.",
      "action": "Если форма готова, идите к лифту справа.",
      "context": "Развилка",
      "image": "./assets/images/step-8-prachechnaya-v2.jpg",
      "alt": "Прачечная и лифт",
      "details": [
        "Прачечная слева.",
        "Лифт справа."
      ]
    },
    {
      "badge": "9",
      "icon": "lift",
      "shortTitle": "Лифт",
      "title": "Вызовите лифт",
      "description": "Подойдёт любой лифт.",
      "action": "Зайдите в лифт и нажмите 1.",
      "context": "Подъём",
      "image": "./assets/images/step-9-lift-v2.jpg",
      "alt": "Вызов лифта",
      "details": [
        "Можно любой лифт.",
        "Нужен этаж 1."
      ]
    },
    {
      "badge": "10",
      "icon": "guest-door",
      "shortTitle": "Дверь",
      "title": "Идите к коричневой двери",
      "description": "Дальше уже гостевая зона.",
      "action": "Откройте дверь аккуратно.",
      "context": "Выход в гостевую зону",
      "image": "./assets/images/step-10-dver-v2.jpg",
      "alt": "Коричневая дверь",
      "details": [
        "Снаружи могут быть гости.",
        "Не выходите резко."
      ]
    },
    {
      "badge": "11",
      "icon": "green",
      "shortTitle": "Шведская",
      "title": "Вход в Шведскую Линию",
      "description": "Финальная точка маршрута.",
      "action": "Заходите в стеклянные двери справа.",
      "context": "Финиш",
      "image": "./assets/images/step-11-green-v2.jpg",
      "alt": "Вход в ресторан Шведская Линия",
      "details": [
        "Идите прямо.",
        "Шведская Линия будет справа."
      ]
    }
  ]
};
