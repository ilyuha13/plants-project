# Kubernetes Deployment Guide - Plants Project

Полное руководство по деплою Plants Project в Kubernetes (k3s) с автоматическим CI/CD через GitHub Actions.

## Что получаем в итоге

✅ **Zero-downtime deployments** - сайт не ложится при обновлениях
✅ **Автоматический деплой** - `git push` → через 3-5 минут код на проде
✅ **Автоматический SSL** - cert-manager управляет сертификатами
✅ **Rolling updates** - Kubernetes постепенно заменяет поды
✅ **Automatic rollback** - откат если новая версия не запускается
✅ **Health checks** - автоматический перезапуск упавших подов

---

## Предварительные требования

- VPS с Ubuntu/Debian (минимум 2GB RAM)
- Домен с DNS записями, указывающими на VPS
- GitHub аккаунт
- Локально установленный kubectl

---

## Шаг 1: Установка k3s на VPS

### 1.1 Подключитесь к VPS и скачайте код

```bash
ssh root@your-vps
cd /root
git clone https://github.com/YOUR_USERNAME/plants-project.git
cd plants-project
```

### 1.2 Запустите установку k3s

```bash
chmod +x k8s-setup.sh
./k8s-setup.sh
```

Скрипт автоматически:
- Остановит старый Docker Compose (если был запущен)
- Установит k3s
- Установит nginx-ingress controller
- Установит cert-manager для автоматических SSL сертификатов
- Подготовит kubeconfig для удалённого доступа

**Время выполнения:** 3-5 минут

### 1.3 Скачайте kubeconfig на локальную машину

```bash
# На локальной машине
scp root@YOUR_VPS_IP:/root/kubeconfig.yaml ~/.kube/plants-k3s.yaml

# Установите KUBECONFIG
export KUBECONFIG=~/.kube/plants-k3s.yaml

# Проверьте подключение
kubectl get nodes
# Должен показать ваш VPS node в статусе Ready
```

---

## Шаг 2: Сборка и публикация Docker образа

### 2.1 Включите GitHub Container Registry

1. Перейдите на https://github.com/settings/tokens
2. Generate new token (classic)
3. Права: `write:packages`, `read:packages`, `delete:packages`
4. Скопируйте токен

### 2.2 Залогиньтесь в GitHub Container Registry

```bash
# На локальной машине
export GITHUB_TOKEN=your_token_here
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 2.3 Соберите и запушьте образ

```bash
cd /path/to/plants-project

# Соберите образ
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/plants-project/backend:latest .

# Запушьте в registry
docker push ghcr.io/YOUR_GITHUB_USERNAME/plants-project/backend:latest
```

### 2.4 Сделайте образ публичным (опционально)

1. Перейдите на https://github.com/users/YOUR_USERNAME/packages
2. Найдите `plants-project/backend`
3. Package settings → Change visibility → Public

Или оставьте приватным и настройте imagePullSecret (см. k8s/README.md)

---

## Шаг 3: Подготовка секретов

### 3.1 Создайте файл с секретами

```bash
cd k8s/
chmod +x prepare-secrets.sh
./prepare-secrets.sh
```

Скрипт прочитает `.env` файл из корня проекта и создаст `01-secrets-filled.yaml` с base64-закодированными значениями.

### 3.2 Обновите email для SSL сертификатов

Отредактируйте `k8s/05-cert-issuer.yaml`:

```yaml
email: your-email@example.com  # ← Ваш email
```

### 3.3 Обновите image в backend deployment

Отредактируйте `k8s/03-backend.yaml` (строка 36):

```yaml
image: ghcr.io/YOUR_GITHUB_USERNAME/plants-project/backend:latest
```

---

## Шаг 4: Деплой в Kubernetes

### 4.1 Примените манифесты

```bash
# Убедитесь что KUBECONFIG установлен
export KUBECONFIG=~/.kube/plants-k3s.yaml

cd k8s/

# Применяем по порядку
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets-filled.yaml
kubectl apply -f 02-postgres.yaml
kubectl apply -f 05-cert-issuer.yaml

# Ждём пока PostgreSQL запустится
kubectl wait --for=condition=Ready pod -l app=postgres -n plants --timeout=120s

# Применяем backend
kubectl apply -f 03-backend.yaml

# Ждём пока backend запустится
kubectl wait --for=condition=Available deployment/backend -n plants --timeout=180s
```

### 4.2 Примените миграции базы данных

```bash
kubectl exec -it deployment/backend -n plants -- sh -c "cd /app/backend && pnpm prisma migrate deploy"
```

### 4.3 Примените Ingress (запустит создание SSL сертификата)

```bash
kubectl apply -f 04-ingress.yaml

# Проверьте статус сертификата
kubectl get certificate -n plants
kubectl describe certificate plants-tls -n plants

# Ждите пока статус станет Ready (2-3 минуты)
kubectl wait --for=condition=Ready certificate/plants-tls -n plants --timeout=300s
```

---

## Шаг 5: Проверка работы

### 5.1 Проверьте поды

```bash
kubectl get pods -n plants

# Должно быть примерно так:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-7d9f8c6b5-abc12     1/1     Running   0          2m
# backend-7d9f8c6b5-def34     1/1     Running   0          2m
# postgres-0                  1/1     Running   0          5m
```

### 5.2 Проверьте логи

```bash
kubectl logs -f deployment/backend -n plants
```

### 5.3 Проверьте API

```bash
curl https://api.greenflagplants.ru/ping
# Должно вернуть: pong
```

### 5.4 Проверьте фронтенд

```bash
curl https://greenflagplants.ru
# Должно вернуть HTML
```

Откройте в браузере: https://greenflagplants.ru

---

## Шаг 6: Настройка автоматического деплоя (GitHub Actions)

### 6.1 Добавьте секреты в GitHub

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие секреты:

**KUBECONFIG** - содержимое файла kubeconfig.yaml в base64:
```bash
cat ~/.kube/plants-k3s.yaml | base64
# Скопируйте весь вывод и вставьте в GitHub Secret
```

**TELEGRAM_BOT_TOKEN** - токен вашего Telegram бота
**TELEGRAM_ADMIN_CHAT_ID** - ваш Telegram chat ID

### 6.2 Сделайте образ публичным ИЛИ настройте imagePullSecret

**Вариант A (проще):** Сделайте GitHub package публичным (см. шаг 2.4)

**Вариант B:** Создайте imagePullSecret:

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=$GITHUB_TOKEN \
  -n plants
```

Затем добавьте в `k8s/03-backend.yaml`:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: backend
          # ...
```

### 6.3 Закоммитьте изменения

```bash
git add .
git commit -m "Add Kubernetes deployment and CI/CD"
git push origin main
```

### 6.4 Проверьте GitHub Actions

1. Перейдите на GitHub → Actions
2. Должен запуститься workflow "Build and Deploy to k3s"
3. Следите за прогрессом:
   - **build** - сборка Docker образа (~3-4 минуты)
   - **deploy** - деплой в k8s (~1-2 минуты)
   - **notify** - отправка уведомления в Telegram

**Общее время:** 5-7 минут от push до деплоя

---

## Шаг 7: Тестирование Zero-Downtime Deployment

### 7.1 Откройте monitoring в отдельном терминале

```bash
# Terminal 1: Следите за подами
watch kubectl get pods -n plants

# Terminal 2: Постоянно пингуйте API
while true; do curl -s https://api.greenflagplants.ru/ping; echo " - $(date +%H:%M:%S)"; sleep 0.5; done
```

### 7.2 Сделайте изменение в коде

```bash
# Например, измените ответ /ping endpoint
# backend/src/index.ts

expressApp.get('/ping', (req, res) => {
  res.send('pong v2')  // ← Изменили
})
```

### 7.3 Закоммитьте и запушьте

```bash
git add .
git commit -m "Test zero-downtime deployment"
git push origin main
```

### 7.4 Наблюдайте за процессом

**Terminal 1** покажет:
1. Создаётся новый под с новым образом
2. Новый под переходит в статус Ready
3. Старый под терминируется
4. В течение всего процесса минимум 1 под работает

**Terminal 2** должен показывать:
- Все запросы успешны (200 OK)
- **Ни одного** failed request
- В какой-то момент ответ изменится с `pong` на `pong v2`

**Downtime:** 0 секунд! 🎉

---

## Полезные команды

### Просмотр ресурсов

```bash
# Все ресурсы в namespace plants
kubectl get all -n plants

# Поды с деталями
kubectl get pods -n plants -o wide

# Логи
kubectl logs -f deployment/backend -n plants

# Логи всех реплик
kubectl logs -f -l app=backend -n plants

# Описание пода (для дебага)
kubectl describe pod POD_NAME -n plants
```

### Управление deployment

```bash
# Масштабирование
kubectl scale deployment/backend --replicas=3 -n plants

# Ручное обновление образа
kubectl set image deployment/backend backend=ghcr.io/USER/plants-project/backend:NEW_TAG -n plants

# Откат к предыдущей версии
kubectl rollout undo deployment/backend -n plants

# История деплоев
kubectl rollout history deployment/backend -n plants

# Статус текущего деплоя
kubectl rollout status deployment/backend -n plants
```

### Работа с базой данных

```bash
# Подключиться к PostgreSQL
kubectl exec -it postgres-0 -n plants -- psql -U plants_user -d plants_db

# Бэкап базы
kubectl exec postgres-0 -n plants -- pg_dump -U plants_user plants_db > backup.sql

# Восстановление
cat backup.sql | kubectl exec -i postgres-0 -n plants -- psql -U plants_user -d plants_db
```

### Дебаг

```bash
# Зайти в под
kubectl exec -it deployment/backend -n plants -- sh

# Проверить переменные окружения
kubectl exec deployment/backend -n plants -- env

# Проверить Ingress
kubectl describe ingress plants-ingress -n plants

# Логи nginx-ingress
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Логи cert-manager
kubectl logs -n cert-manager deployment/cert-manager
```

---

## Troubleshooting

### Проблема: Pod не стартует

```bash
# Проверьте события
kubectl describe pod POD_NAME -n plants

# Частые причины:
# - ImagePullBackOff: образ недоступен (сделайте публичным или добавьте imagePullSecret)
# - CrashLoopBackOff: приложение падает при старте (проверьте логи)
# - Pending: недостаточно ресурсов (проверьте kubectl describe node)
```

### Проблема: SSL сертификат не создаётся

```bash
# Проверьте статус сертификата
kubectl describe certificate plants-tls -n plants

# Проверьте challenge
kubectl get challenges -n plants

# Проверьте cert-manager логи
kubectl logs -n cert-manager deployment/cert-manager

# Убедитесь что домен указывает на правильный IP
dig api.greenflagplants.ru
```

### Проблема: 502 Bad Gateway от Ingress

```bash
# Проверьте что backend работает
kubectl get pods -n plants
kubectl logs -f deployment/backend -n plants

# Проверьте Service
kubectl get svc -n plants
kubectl describe svc backend -n plants

# Проверьте Ingress
kubectl describe ingress plants-ingress -n plants
```

### Проблема: GitHub Actions не может подключиться к кластеру

```bash
# Проверьте что KUBECONFIG секрет правильный
# Он должен быть в base64 И содержать правильный server IP

# На VPS проверьте:
cat /root/kubeconfig.yaml | grep server:
# Должен быть: https://YOUR_VPS_IP:6443
# НЕ должно быть: https://127.0.0.1:6443
```

---

## Удаление всего (если нужно начать сначала)

```bash
# Удалить namespace (удалит все ресурсы внутри)
kubectl delete namespace plants

# Удалить cert-manager
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.yaml

# Удалить nginx-ingress
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml

# Удалить k3s полностью
ssh root@your-vps
/usr/local/bin/k3s-uninstall.sh
```

---

## Что дальше?

- [ ] Настроить мониторинг (Prometheus + Grafana)
- [ ] Настроить автоматические бэкапы PostgreSQL
- [ ] Добавить HorizontalPodAutoscaler для автомасштабирования
- [ ] Настроить staging окружение
- [ ] Добавить e2e тесты в CI/CD

---

**Поздравляю! У тебя теперь production-grade Kubernetes deployment! 🚀**
