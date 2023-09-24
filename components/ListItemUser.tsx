import { ListItemAvatar, Avatar, ListItemText } from "@mui/material"
import { User } from "@prisma/client"
import { defaultTheme } from "../styles/theme"

const ListItemUser = ({ user, valueType = "drinks" }: { user: User; valueType?: "drinks" | "payments" | "events" }) => (
	<>
		<ListItemAvatar>
			<Avatar alt="S" />
		</ListItemAvatar>
		<ListItemText>
			<span style={{ fontWeight: "bold", color: defaultTheme.palette.primary.main }}>
				{valueType === "drinks" ? user.drinkCount : valueType === "events" ? user.eventCount : user.paymentSum}
			</span>{" "}
			- <span>{user.username}</span>
		</ListItemText>
	</>
)

export { ListItemUser }
