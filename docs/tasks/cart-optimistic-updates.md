# Оптимистичное обновление корзины

**Приоритет:** 🔵 UX улучшение (после MVP)
**Время:** 2 часа
**Связано:** Кнопки "В корзину" на карточках экземпляров

---

## Проблема

### Сценарий:
1. Пользователь на странице `PlantDetailPage`
2. Видит список доступных экземпляров растения
3. Добавляет экземпляр в корзину → экземпляр исчезает из списка (статус → `IN_CART`)
4. **Удаляет из корзины** (через CartDrawer)
5. **Экземпляр НЕ появляется сразу в списке** ❌

### Почему так происходит:

```typescript
// CartItem.tsx
await removeItem.mutateAsync({ userId: me.id, cartItemId: item.id })
await utils.getCart.invalidate()           // ✅ Корзина обновилась
await utils.getPlantInstance.invalidate()  // ✅ Экземпляр обновился

// ❌ НО getPlant НЕ инвалидируется
// → PlantDetailPage не знает что экземпляр снова AVAILABLE
// → Список экземпляров не обновился
```

### Ожидаемое поведение:
- Пользователь удаляет из корзины
- Экземпляр **мгновенно появляется** в списке доступных
- С кнопкой "Добавить в корзину"

---

## Варианты решения

### Вариант 1: Инвалидация getPlant (простой)

**Код:**
```typescript
// CartItem.tsx
await removeItem.mutateAsync({ userId: me.id, cartItemId: item.id })
await utils.getCart.invalidate()
await utils.getPlantInstance.invalidate()
await utils.getPlant.invalidate()  // ← Добавить
```

**Плюсы:**
- ✅ Простое решение (1 строка)
- ✅ Работает везде

**Минусы:**
- ❌ Лишний запрос если пользователь не на PlantDetailPage
- ❌ ~200ms задержка (загрузка растения + всех экземпляров)

---

### Вариант 2: Условная инвалидация (средний)

**Код:**
```typescript
// CartItem.tsx
await removeItem.mutateAsync({ userId: me.id, cartItemId: item.id })
await utils.getCart.invalidate()
await utils.getPlantInstance.invalidate()

// Инвалидировать getPlant только если на PlantDetailPage
if (window.location.pathname.includes('/plant/')) {
  await utils.getPlant.invalidate()
}
```

**Плюсы:**
- ✅ Инвалидирует только когда нужно
- ✅ Не грузит лишнее

**Минусы:**
- ❌ Завязка на URL
- ❌ Всё равно ~200ms задержка

---

### Вариант 3: Optimistic updates (лучший UX)

**Код:**
```typescript
// CartItem.tsx
const removeItem = trpc.removeFromCart.useMutation({
  onMutate: async ({ cartItemId, plantInstanceId }) => {
    // 1. Отменить текущие запросы
    await utils.getCart.cancel()
    await utils.getPlant.cancel()

    // 2. Сохранить старые данные (для rollback)
    const previousCart = utils.getCart.getData()
    const previousPlant = utils.getPlant.getData()

    // 3. Оптимистично обновить корзину
    utils.getCart.setData(undefined, (old) => ({
      ...old,
      items: old.items.filter(item => item.id !== cartItemId)
    }))

    // 4. Оптимистично обновить список экземпляров
    utils.getPlant.setData({ plantId }, (old) => ({
      ...old,
      plant: {
        ...old.plant,
        plantInstances: old.plant.plantInstances.map(instance =>
          instance.Id === plantInstanceId
            ? { ...instance, status: 'AVAILABLE' }
            : instance
        )
      }
    }))

    return { previousCart, previousPlant }
  },

  onError: (err, variables, context) => {
    // Откатить если ошибка
    if (context?.previousCart) {
      utils.getCart.setData(undefined, context.previousCart)
    }
    if (context?.previousPlant) {
      utils.getPlant.setData({ plantId }, context.previousPlant)
    }
  },

  onSettled: () => {
    // Синхронизировать с сервером
    utils.getCart.invalidate()
    utils.getPlant.invalidate()
  }
})
```

**Плюсы:**
- ✅ **Мгновенный UI** (0ms)
- ✅ Не ждем сервера
- ✅ Автоматический rollback
- ✅ Лучший UX

**Минусы:**
- ❌ Сложнее код
- ❌ Нужно знать plantId
- ❌ Нужно обновлять структуру вручную

---

## Рекомендация

### Сейчас (MVP):
**Вариант 1** - просто добавить `utils.getPlant.invalidate()`

**Почему:**
- Быстро реализовать
- Работает надежно
- Для маленького трафика не критично

### После MVP:
**Вариант 3** - optimistic updates

**Когда:**
- Растет количество пользователей
- Важна скорость UI
- Есть время на качественный рефакторинг

---

## Дополнительно: Кнопки на карточках

**После добавления кнопок "В корзину" на PlantCard:**

```typescript
// PlantCard.tsx (instance type)
<Button
  onClick={async () => {
    await addToCart.mutateAsync({ userId: me.id, plantInstanceId: data.Id })
    // Обновить список сразу:
    await utils.getPlant.invalidate()
  }}
>
  Добавить в корзину
</Button>
```

**То же самое:**
- Добавил → экземпляр исчез (IN_CART)
- Удалил → экземпляр появился (AVAILABLE)
- Нужно мгновенное обновление UI

---

## Checklist реализации

### Вариант 1 (быстрый):
- [ ] Добавить `utils.getPlant.invalidate()` в CartItem
- [ ] Протестировать на PlantDetailPage
- [ ] Убедиться что экземпляр появляется после удаления

### Вариант 3 (качественный):
- [ ] Изучить React Query optimistic updates
- [ ] Реализовать onMutate в removeFromCart
- [ ] Реализовать onError rollback
- [ ] Добавить plantInstanceId в removeFromCart input
- [ ] Протестировать normal flow
- [ ] Протестировать error flow (сеть отключена)
- [ ] Добавить то же для addToCart

---

## Ссылки

- [React Query: Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [tRPC: Optimistic Updates](https://trpc.io/docs/client/react/useUtils#optimistic-updates)
