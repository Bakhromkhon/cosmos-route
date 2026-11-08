# COSMOS · STAFF ROUTE — маршрут для персонала

Пошаговый офлайн-маршрут от фасада отеля «Космос Прибалтийская» до ресторана «Шведская Линия».
Чистая статика (HTML + CSS + JS) с PWA-режимом: после первого открытия работает без интернета
и устанавливается на телефон как приложение.

**Сайт:** https://bakhromkhon.github.io/cosmos-route/

## Как открыть локально

- **Двойной клик по `index.html`** — маршрут берётся из встроенной копии `data/route.js`, сервер не нужен.
- **`open-route.command`** — локальный сервер `http://127.0.0.1:8123/`. Нужен для полного PWA-режима
  (офлайн-кеш, установка на телефон, баннер обновления).

## Структура

```
index.html               разметка обоих экранов (старт + навигация)
css/app.css              все стили (адаптив: десктоп / планшет / телефон)
js/main.js               логика: рендер шагов, прогресс, свайпы, модалка, Service Worker
data/route.json          данные маршрута (источник правды)
data/route.js            встроенная копия route.json для запуска без сервера
sw.js                    Service Worker: прекеш, офлайн, обновления
manifest.webmanifest.json  манифест PWA (иконки, название, цвета)
assets/images/*-v2.jpg   фотографии ориентиров
icons/                   иконки приложения
```

## Как обновить маршрут

1. Отредактируйте `data/route.json` (поля шага: `badge`, `shortTitle`, `title`, `description`,
   `action`, `image`, `details`).
2. Пересоберите встроенную копию:
   ```sh
   node -e 'const fs=require("fs");fs.writeFileSync("data/route.js","// Встроенная копия data/route.json.\nwindow.ROUTE_DATA = "+JSON.stringify(JSON.parse(fs.readFileSync("data/route.json","utf8")),null,2)+";\n")'
   ```
3. Если меняли CSS или JS — поднимите версии `?v=` в `index.html` и в списке `SHELL_ASSETS` в `sw.js`,
   а также `CACHE_VERSION` в `sw.js`.
4. Закоммитьте и запушьте — сайт обновится автоматически.

## Деплой

GitHub Pages: ветка `main`, корень репозитория. Любой `git push` в `main` = публикация обновления.
Пометка `.nojekyll` отключает обработку Jekyll, `robots.txt` закрывает сайт от поисковиков.
