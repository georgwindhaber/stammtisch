type DrinkType = "Beer" | "Wine" | "Water" | "Softdrink"

export type Drink = {
	id: number
	type: DrinkType
	created: Date
	lastUpdate: Date
	user: "string"
}
