import { Fade, Skeleton, styled } from "@mui/material"

const ListSkeleton = styled(Skeleton)({
	width: "calc(100% + 1rem)",
	height: "92.5%",
	position: "absolute",
	left: "-0.5rem",
})

const LoadingOverlay = ({ visible }: { visible: boolean }) => (
	<Fade in={visible}>
		<ListSkeleton variant="rounded" animation="wave" />
	</Fade>
)

export { LoadingOverlay }
