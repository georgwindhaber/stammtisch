import { Container, List, ListItem, Input, Fab } from "@mui/material"
import type { NextPage } from "next"
import { useBackend } from "../hooks/use-backend"
import { User } from "@prisma/client"
import { ListItemUser } from "../components/ListItemUser"
import { Euro } from "@mui/icons-material"
import { useState } from "react"
import { BottomDrawer } from "../components/UserLists/BottomDrawer"
import { FabContainer } from "../components/UserLists/FabContainer"
import { LoadingOverlay } from "../components/UserLists/LoadingOverlay"

const Bezahlt: NextPage = () => {
	const { data: users, fetch: fetchUsers, isLoading: isLoadingUsers } = useBackend<User[]>("/api/users", {}, true)
	const [userPayments, setUserPayments] = useState<Array<{ userId: number; payment: number }>>([])

	const { fetch: payment, isLoading: isLoadingPayments } = useBackend("/api/payments", {
		method: "POST",
		data: { userPayments },
	})
	const [isActionDisabled, setIsActionDisabled] = useState<boolean>(false)

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
		setIsActionDisabled(true)
		await payment()
		await fetchUsers()
		setUserPayments([])
		setIsActionDisabled(false)
	}

	return (
		<>
			<Container fixed maxWidth="md">
				<List dense>
					{users &&
						users
							.sort((a, b) => b.paymentSum - a.paymentSum)
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
										<LoadingOverlay
											visible={
												(isLoadingPayments || isLoadingUsers) && !!userPayments.find((u) => u.userId === user.userId)
											}
										/>
									</ListItem>
								)
							})}
				</List>
			</Container>
			<BottomDrawer>
				<FabContainer>
					<Fab color="primary" onClick={handlePayment} disabled={userPayments.length === 0 || isActionDisabled}>
						<Euro fontSize="large" />
					</Fab>
				</FabContainer>
			</BottomDrawer>
		</>
	)
}

export default Bezahlt
