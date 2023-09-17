import { Container, List, ListItem, Input, Fab, styled } from "@mui/material"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { User } from "@prisma/client"
import { ListItemUser } from "../components/ListItemUser"
import { Euro, SportsBar } from "@mui/icons-material"
import { useState } from "react"

const BottomDrawer = styled("section")({
	position: "absolute",
	bottom: 10,
	display: "flex",
	justifyContent: "center",
	width: "100%",
})

const FabContainer = styled("div")({
	position: "relative",
	display: "flex",
	alignItems: "center",
})

const Bezahlt: NextPage = () => {
	const { data: users, fetch: fetchUsers } = useBackend<User[]>("/api/users")
	const [userPayments, setUserPayments] = useState<Array<{ userId: number; payment: number }>>([])

	const { fetch: payment } = useBackend<any>("/api/payments", {
		method: "POST",
		data: { userPayments },
	})

	const handlePaymentChange = (userId: number, payment: number) => {
		if (!payment) {
			payment = 0
		}
		const currentIndex = userPayments.findIndex((user) => user.userId === userId)
		const newPayments = [...userPayments]

		if (currentIndex === -1) {
			newPayments.push({ userId, payment })
		} else {
			newPayments[currentIndex] = { userId, payment }
		}

		setUserPayments(newPayments.filter((user) => user.payment !== 0))
	}

	const handlePayment = async () => {
		await payment()
		await fetchUsers()
		setUserPayments([])
	}

	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users &&
						users
							.sort((a, b) => b.drinkCount - a.drinkCount)
							.map((user) => {
								return (
									<ListItem
										key={user.userId}
										disableGutters
										secondaryAction={
											<Input
												type="number"
												size="small"
												placeholder="100"
												value={userPayments.find((u) => u.userId === user.userId)?.payment || ""}
												onChange={(e) => {
													handlePaymentChange(user.userId, parseInt(e.target.value))
												}}
											/>
										}
									>
										<ListItemUser user={user} valueType="payments" />
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handlePayment} disabled={userPayments.length === 0}>
						<Euro fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Bezahlt
