#!/bin/zsh
set -u
cd "$(dirname "$0")"
BASE="https://bakhromkhon.github.io/cosmos-route"
FAILED=0
echo "Загружаю только отсутствующие оригинальные ресурсы с GitHub Pages..."
if [[ ! -s "assets/images/step-1-fasad-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-1-fasad-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-1-fasad-v2.jpg" -o "assets/images/step-1-fasad-v2.jpg.partial"; then mv "assets/images/step-1-fasad-v2.jpg.partial" "assets/images/step-1-fasad-v2.jpg"; echo "OK assets/images/step-1-fasad-v2.jpg"; else rm -f "assets/images/step-1-fasad-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-1-fasad-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-2-vhod-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-2-vhod-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-2-vhod-v2.jpg" -o "assets/images/step-2-vhod-v2.jpg.partial"; then mv "assets/images/step-2-vhod-v2.jpg.partial" "assets/images/step-2-vhod-v2.jpg"; echo "OK assets/images/step-2-vhod-v2.jpg"; else rm -f "assets/images/step-2-vhod-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-2-vhod-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-3-ohrana-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-3-ohrana-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-3-ohrana-v2.jpg" -o "assets/images/step-3-ohrana-v2.jpg.partial"; then mv "assets/images/step-3-ohrana-v2.jpg.partial" "assets/images/step-3-ohrana-v2.jpg"; echo "OK assets/images/step-3-ohrana-v2.jpg"; else rm -f "assets/images/step-3-ohrana-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-3-ohrana-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-4-shkafchik-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-4-shkafchik-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-4-shkafchik-v2.jpg" -o "assets/images/step-4-shkafchik-v2.jpg.partial"; then mv "assets/images/step-4-shkafchik-v2.jpg.partial" "assets/images/step-4-shkafchik-v2.jpg"; echo "OK assets/images/step-4-shkafchik-v2.jpg"; else rm -f "assets/images/step-4-shkafchik-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-4-shkafchik-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-5-6-razdevalki-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-5-6-razdevalki-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-5-6-razdevalki-v2.jpg" -o "assets/images/step-5-6-razdevalki-v2.jpg.partial"; then mv "assets/images/step-5-6-razdevalki-v2.jpg.partial" "assets/images/step-5-6-razdevalki-v2.jpg"; echo "OK assets/images/step-5-6-razdevalki-v2.jpg"; else rm -f "assets/images/step-5-6-razdevalki-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-5-6-razdevalki-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-7-koridor-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-7-koridor-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-7-koridor-v2.jpg" -o "assets/images/step-7-koridor-v2.jpg.partial"; then mv "assets/images/step-7-koridor-v2.jpg.partial" "assets/images/step-7-koridor-v2.jpg"; echo "OK assets/images/step-7-koridor-v2.jpg"; else rm -f "assets/images/step-7-koridor-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-7-koridor-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-8-prachechnaya-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-8-prachechnaya-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-8-prachechnaya-v2.jpg" -o "assets/images/step-8-prachechnaya-v2.jpg.partial"; then mv "assets/images/step-8-prachechnaya-v2.jpg.partial" "assets/images/step-8-prachechnaya-v2.jpg"; echo "OK assets/images/step-8-prachechnaya-v2.jpg"; else rm -f "assets/images/step-8-prachechnaya-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-8-prachechnaya-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-9-lift-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-9-lift-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-9-lift-v2.jpg" -o "assets/images/step-9-lift-v2.jpg.partial"; then mv "assets/images/step-9-lift-v2.jpg.partial" "assets/images/step-9-lift-v2.jpg"; echo "OK assets/images/step-9-lift-v2.jpg"; else rm -f "assets/images/step-9-lift-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-9-lift-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-10-dver-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-10-dver-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-10-dver-v2.jpg" -o "assets/images/step-10-dver-v2.jpg.partial"; then mv "assets/images/step-10-dver-v2.jpg.partial" "assets/images/step-10-dver-v2.jpg"; echo "OK assets/images/step-10-dver-v2.jpg"; else rm -f "assets/images/step-10-dver-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-10-dver-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/images/step-11-green-v2.jpg" ]]; then
  mkdir -p "$(dirname "assets/images/step-11-green-v2.jpg")"
  if curl -fLsS --max-time 25 "$BASE/assets/images/step-11-green-v2.jpg" -o "assets/images/step-11-green-v2.jpg.partial"; then mv "assets/images/step-11-green-v2.jpg.partial" "assets/images/step-11-green-v2.jpg"; echo "OK assets/images/step-11-green-v2.jpg"; else rm -f "assets/images/step-11-green-v2.jpg.partial"; echo "НЕ СКАЧАН: assets/images/step-11-green-v2.jpg"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/inter-normal-cyrillic.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/inter-normal-cyrillic.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/inter-normal-cyrillic.woff2" -o "assets/fonts/inter-normal-cyrillic.woff2.partial"; then mv "assets/fonts/inter-normal-cyrillic.woff2.partial" "assets/fonts/inter-normal-cyrillic.woff2"; echo "OK assets/fonts/inter-normal-cyrillic.woff2"; else rm -f "assets/fonts/inter-normal-cyrillic.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/inter-normal-cyrillic.woff2"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/inter-normal-latin.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/inter-normal-latin.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/inter-normal-latin.woff2" -o "assets/fonts/inter-normal-latin.woff2.partial"; then mv "assets/fonts/inter-normal-latin.woff2.partial" "assets/fonts/inter-normal-latin.woff2"; echo "OK assets/fonts/inter-normal-latin.woff2"; else rm -f "assets/fonts/inter-normal-latin.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/inter-normal-latin.woff2"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/playfair-display-italic-cyrillic.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/playfair-display-italic-cyrillic.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/playfair-display-italic-cyrillic.woff2" -o "assets/fonts/playfair-display-italic-cyrillic.woff2.partial"; then mv "assets/fonts/playfair-display-italic-cyrillic.woff2.partial" "assets/fonts/playfair-display-italic-cyrillic.woff2"; echo "OK assets/fonts/playfair-display-italic-cyrillic.woff2"; else rm -f "assets/fonts/playfair-display-italic-cyrillic.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/playfair-display-italic-cyrillic.woff2"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/playfair-display-italic-latin.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/playfair-display-italic-latin.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/playfair-display-italic-latin.woff2" -o "assets/fonts/playfair-display-italic-latin.woff2.partial"; then mv "assets/fonts/playfair-display-italic-latin.woff2.partial" "assets/fonts/playfair-display-italic-latin.woff2"; echo "OK assets/fonts/playfair-display-italic-latin.woff2"; else rm -f "assets/fonts/playfair-display-italic-latin.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/playfair-display-italic-latin.woff2"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/playfair-display-normal-cyrillic.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/playfair-display-normal-cyrillic.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/playfair-display-normal-cyrillic.woff2" -o "assets/fonts/playfair-display-normal-cyrillic.woff2.partial"; then mv "assets/fonts/playfair-display-normal-cyrillic.woff2.partial" "assets/fonts/playfair-display-normal-cyrillic.woff2"; echo "OK assets/fonts/playfair-display-normal-cyrillic.woff2"; else rm -f "assets/fonts/playfair-display-normal-cyrillic.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/playfair-display-normal-cyrillic.woff2"; FAILED=1; fi
fi
if [[ ! -s "assets/fonts/playfair-display-normal-latin.woff2" ]]; then
  mkdir -p "$(dirname "assets/fonts/playfair-display-normal-latin.woff2")"
  if curl -fLsS --max-time 25 "$BASE/assets/fonts/playfair-display-normal-latin.woff2" -o "assets/fonts/playfair-display-normal-latin.woff2.partial"; then mv "assets/fonts/playfair-display-normal-latin.woff2.partial" "assets/fonts/playfair-display-normal-latin.woff2"; echo "OK assets/fonts/playfair-display-normal-latin.woff2"; else rm -f "assets/fonts/playfair-display-normal-latin.woff2.partial"; echo "НЕ СКАЧАН: assets/fonts/playfair-display-normal-latin.woff2"; FAILED=1; fi
fi
if [[ "$FAILED" == 0 ]]; then echo "Готово. Запусти open-route.command"; else echo "Не все файлы скачались. Скопируй их из оригинальной локальной папки assets/"; fi
read -r "reply?Нажмите Enter для выхода..."
exit "$FAILED"
