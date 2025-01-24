import { type ComponentProps, useEffect, useState, useCallback } from "react";
import { cn } from "../styles/utils";

type GameState = {
	position: number;
	score: number;
	isJumping: boolean;
	items: Array<{
		id: number;
		position: number;
		type: "trash" | "food";
	}>;
};

export type GameProps = ComponentProps<"div">;

export function Game({ className, ...props }: GameProps) {
	const [gameState, setGameState] = useState<GameState>({
		position: 300,
		score: 0,
		isJumping: false,
		items: Array.from({ length: 5 }, (_, i) => ({
			id: i,
			position: Math.random() * 550 + 25,
			type: Math.random() > 0.5 ? "trash" : "food",
		})),
	});

	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				setGameState((prev) => ({
					...prev,
					position: Math.max(25, prev.position - 20),
				}));
			} else if (event.key === "ArrowRight") {
				setGameState((prev) => ({
					...prev,
					position: Math.min(575, prev.position + 20),
				}));
			} else if (event.key === "ArrowUp" && !gameState.isJumping) {
				setGameState((prev) => ({ ...prev, isJumping: true }));
				setTimeout(() => {
					setGameState((prev) => ({ ...prev, isJumping: false }));
				}, 500);
			}
		},
		[gameState.isJumping],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [handleKeyPress]);

	useEffect(() => {
		const checkCollisions = () => {
			setGameState((prev) => {
				const collidedItems = prev.items.filter(
					(item) => Math.abs(item.position - prev.position) < 40,
				);

				if (collidedItems.length === 0) return prev;

				const newScore =
					prev.score +
					collidedItems.reduce((acc, item) => {
						return acc + (item.type === "food" ? 10 : 5);
					}, 0);

				const remainingItems = prev.items.filter(
					(item) => !collidedItems.some((collided) => collided.id === item.id),
				);

				return {
					...prev,
					score: newScore,
					items: remainingItems,
				};
			});
		};

		const gameLoop = setInterval(checkCollisions, 100);
		return () => clearInterval(gameLoop);
	}, []);

	return (
		<div
			className={cn(
				"relative h-full w-full bg-gradient-to-b from-blue-400 to-blue-600 p-4",
				className,
			)}
			{...props}
		>
			{/* Score */}
			<div className="absolute top-4 left-4 font-bold text-2xl text-white">
				Score: {gameState.score}
			</div>

			{/* Raccoon */}
			<div
				className={cn(
					"absolute bottom-8 h-20 w-20 rounded-full bg-gray-600 transition-all duration-150",
					gameState.isJumping ? "animate-bounce" : "",
				)}
				style={{ left: gameState.position }}
			>
				{/* Raccoon face */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="h-8 w-8 rounded-full bg-gray-300" />
					<div
						className="absolute top-4 h-2 w-2 rounded-full bg-black"
						style={{ left: "45%" }}
					/>
					<div
						className="absolute top-4 h-2 w-2 rounded-full bg-black"
						style={{ right: "45%" }}
					/>
				</div>
			</div>

			{/* Items */}
			{gameState.items.map((item) => (
				<div
					key={item.id}
					className={cn(
						"absolute bottom-8 h-8 w-8 rounded-full transition-all duration-150",
						item.type === "food" ? "bg-yellow-400" : "bg-gray-400",
					)}
					style={{ left: item.position }}
				/>
			))}
		</div>
	);
}
