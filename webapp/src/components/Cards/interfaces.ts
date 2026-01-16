interface Card {
  name: string
  description: string | null
  imagesUrl: string[]
  onDeleteClick: (() => void) | null
  onEditClick?: () => void
}

export interface InstanceCard extends Card {
  type: 'instance'
  inventoryNumber: string | null
  price: string | null
  createdAt?: Date
  onAddToCart?: () => Promise<void>
}

export interface ReferenceCard extends Card {
  type: 'reference'
  quantity?: number
}
