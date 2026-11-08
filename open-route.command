#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
python3 -c '
import http.server, webbrowser

PORT = 8123

server = None
try:
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), http.server.SimpleHTTPRequestHandler)
except OSError:
    # Порт занят — берём свободный, но тогда браузер считает это другим сайтом.
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    PORT = server.server_port

url = f"http://127.0.0.1:{PORT}/"
print(f"Открываю маршрут: {url}\nОставьте это окно открытым. Для остановки нажмите Ctrl+C.", flush=True)
webbrowser.open(url)
server.serve_forever()
'
