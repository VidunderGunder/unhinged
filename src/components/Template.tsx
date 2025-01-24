import type { ComponentProps } from "react";
import { cn } from "../styles/utils";

export type GameProps = ComponentProps<"div">;

export function Game({ className, ...props }: GameProps) {
	return (
		<div className={cn("h-full w-full", className)} {...props}>
			{/* */}
		</div>
	);
}
