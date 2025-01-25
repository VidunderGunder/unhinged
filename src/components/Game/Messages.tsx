import type { ComponentProps } from "react";
import { cn } from "../../styles/utils";

export type MessagesProps = ComponentProps<"div">;

export function Messages({ className, ...props }: MessagesProps) {
	return (
		<div className={cn("h-full w-full", className)} {...props}>
			{/* */}
		</div>
	);
}
