type DrinkType = "Beer" | "Wine" | "Water" | "Softdrink"

export type Drink = {
	id: number
	attributes: {
		Type: DrinkType
		createdAt: Date
		updatedAt: Date
		user: "string"
	}
}
