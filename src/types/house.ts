type HouseHeads = {
  id: string
  firstName: string
  lastName: string
}

type Traits = {
  id: string
  name: string
}

export type HousePoints = Record<string, number>

export interface House {
  id: string
  name: string
  founder: string
  animal: string
  commonRoom: string
  element: string
  houseColors: string
  ghost: string
  heads: HouseHeads[]
  traits: Traits[]
}
