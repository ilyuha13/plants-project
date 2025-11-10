# Реализация корзины

**Приоритет:** 🔴 КРИТИЧНО
**Время:** 4 часа
**Статус:** ✅ Выполнено

## Почему критично

Без корзины сайт - просто витрина. Пользователь не может собрать заказ, приходится писать по каждому товару отдельно. Корзина - базовый функционал интернет-магазина.

## Checklist

### 1. Backend - БД (30 мин) ✅

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]

  @@unique([userId])
}

model CartItem {
  id              String        @id @default(uuid())
  cartId          String
  cart            Cart          @relation(fields: [cartId], references: [id], onDelete: Cascade)
  plantInstanceId String
  plantInstance   PlantInstance @relation(fields: [plantInstanceId], references: [Id], onDelete: Cascade)
  addedAt         DateTime      @default(now())

  @@unique([cartId, plantInstanceId])
}
```

### 2. Backend - tRPC роуты (1 час) ✅

- [x] `getCart` - получить корзину с товарами
- [x] `addToCart` - добавить товар
- [x] `removeFromCart` - удалить товар
- [x] `clearCart` - очистить корзину

### 3. Frontend - Zustand store (30 мин) ✅

```tsx
// cartStore.ts
type CartStore = {
  items: CartItem[]
  isOpen: boolean
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}
```

### 4. Frontend - CartButton в Header (30 мин) ✅

- [x] IconButton с Badge (количество товаров)
- [x] Клик → открывает CartDrawer

### 5. Frontend - CartDrawer (1 час) ✅

- [x] MUI Drawer справа
- [x] Список товаров (фото, название, цена, кнопка удалить)
- [x] Пустое состояние ("Корзина пуста")
- [x] Итоговая сумма внизу

### 6. Frontend - Кнопки "В корзину" (30 мин) ✅

- [x] DetailCard - кнопка рядом с ценой
- [x] Статусы: "Добавление...", "В корзине", "Продано"

### 7. Интеграция с Telegram (pending)

- [ ] Кнопка "Оформить заказ" формирует сообщение
- [ ] После отправки - clearCart()
