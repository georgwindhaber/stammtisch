import { ListItemAvatar, Avatar, ListItemText } from "@mui/material"
import { User } from "@prisma/client"
import { defaultTheme } from "../styles/theme"

const ListItemUser = ({
	user,
	valueType,
}: {
	user: Pick<User, "drinkCount" | "eventCount" | "paymentSum" | "username">
	valueType?: "drinks" | "payments" | "events"
}) => {
	return (
		<>
			<ListItemAvatar>
				<Avatar alt="S" />
			</ListItemAvatar>
			<ListItemText>
				<span style={{ fontWeight: "bold", color: defaultTheme.palette.primary.main }}>
					{valueType === "drinks"
						? user.drinkCount
						: valueType === "events"
						? user.eventCount
						: valueType === "payments"
						? user.paymentSum
						: null}
				</span>
				{valueType && <span> - </span>}
				<span>{user.username}</span>
			</ListItemText>
		</>
	)
}

export { ListItemUser }
