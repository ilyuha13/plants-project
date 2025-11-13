# Nginx Configuration

Два конфигурационных файла для разных этапов деплоя.

## Файлы

### `nginx.http.conf`
Используется на **первом этапе** для получения SSL сертификата от Let's Encrypt.
- Работает только на HTTP (порт 80)
- Проксирует все запросы на backend
- Отдает файлы для ACME challenge (проверка домена)

### `nginx.https.conf`
Используется **после получения SSL сертификата** для production.
- Работает на HTTPS (порт 443)
- Редиректит HTTP → HTTPS
- Включены security headers
- HTTP/2 поддержка
- GZIP компрессия

## Процесс деплоя

### 1. Запуск с HTTP конфигом
```bash
# В docker-compose.yml используется nginx.http.conf по умолчанию
docker-compose up -d
```

### 2. Получение SSL сертификата
```bash
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  -d greenflagplants.ru \
  -d www.greenflagplants.ru \
  --email your@email.com \
  --agree-tos \
  --non-interactive
```

### 3. Переключение на HTTPS конфиг
```bash
# Изменить в docker-compose.yml:
# - ./nginx/nginx.http.conf:/etc/nginx/nginx.conf:ro
# на:
# - ./nginx/nginx.https.conf:/etc/nginx/nginx.conf:ro

# Перезапустить nginx
docker-compose restart nginx
```

## Обновление сертификата

Сертификаты Let's Encrypt действуют 90 дней. Certbot автоматически обновляет их каждые 12 часов.

Для ручного обновления:
```bash
docker-compose run --rm certbot renew
docker-compose restart nginx
```
