import { expect, it } from 'vitest'

import { callerFor, createCart, createInstance, createUser } from './helpers'

it('hides inventory numbers in the catalog for visitors and customers, retaining admin access', async () => {
  const customer = await createUser()
  const admin = await createUser('ADMIN')
  const instance = await createInstance()
  for (const viewer of [null, customer, admin]) {
    const caller = callerFor(viewer)
    const responses = [
      (await caller.getPlantInstance({ id: instance.id })).instance,
      (await caller.getPlant({ id: instance.plantId })).plant.plantInstances[0],
      (await caller.getPlantInstances()).instances[0],
      (await caller.getAllInstances()).instances[0],
    ]
    for (const record of responses) {
      if (viewer?.role === 'ADMIN') {
        expect(record.inventoryNumber).toBe(instance.inventoryNumber)
      } else {
        expect(record).not.toHaveProperty('inventoryNumber')
      }
    }
  }
})

it('omits inventory numbers from the customer cart', async () => {
  const customer = await createUser()
  const instance = await createInstance('IN_CART')
  await createCart(customer.id, instance.id)
  expect(
    (await callerFor(customer).getCart())?.items[0].plantInstance,
  ).not.toHaveProperty('inventoryNumber')
})
