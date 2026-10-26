// Inventory numbers belong to internal stock management, not customer responses.
export const withInventoryVisibility = <T extends { inventoryNumber: string | null }>(
  entity: T,
  isAdmin: boolean,
): Omit<T, 'inventoryNumber'> & { inventoryNumber?: T['inventoryNumber'] } => {
  const result: Omit<T, 'inventoryNumber'> & { inventoryNumber?: T['inventoryNumber'] } =
    { ...entity }
  if (!isAdmin) {
    delete result.inventoryNumber
  }
  return result
}
