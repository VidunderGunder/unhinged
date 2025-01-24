import type { ComponentProps } from "react";
import { Game } from "./components/Game";
import { cn } from "./styles/utils";

export type AppProps = ComponentProps<"div">;

export function App({ className, ...props }: AppProps) {
	return (
		<div
			className={cn("h-full w-full items-center justify-center", className)}
			{...props}
		>
			<Game />
		</div>
	);
}
