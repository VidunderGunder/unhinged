import type { ComponentProps } from "react";
import { cn } from "../styles/utils";

export type GameProps = ComponentProps<"div">;

const assets = [
	{
		id: 1,
		angry: "/angry-1.jpg",
		happy: "/angry-1.jpg",
	},
	{
		id: 2,
		angry: "/angry-2.jpg",
		happy: "/angry-2.jpg",
	},
	{
		id: 3,
		angry: "/angry-3.jpg",
		happy: "/angry-3.jpg",
	},
];

export function Game({ className, ...props }: GameProps) {
	return (
		<div className={cn("h-full w-full", className)} {...props}>
			{/* */}
		</div>
	);
}
