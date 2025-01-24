import type { ComponentProps } from "react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "../styles/utils";

export type GameProps = ComponentProps<"div">;

const assets = [
	{
		id: 1,
		angry: "/angry-1.jpg",
		happy: "/happy-1.jpg",
	},
	{
		id: 2,
		angry: "/angry-2.jpg",
		happy: "/happy-2.jpg",
	},
	{
		id: 3,
		angry: "/angry-3.jpg",
		happy: "/happy-3.jpg",
	},
];

interface GirlState {
	id: number;
	angryLevel: number;
	position: { x: number; y: number };
	velocity: { dx: number; dy: number };
}

export function Game({ className, ...props }: GameProps) {
	const [showWarning, setShowWarning] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWarning(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	const [girls, setGirls] = useState<GirlState[]>(() =>
		assets.map((asset) => ({
			id: asset.id,
			angryLevel: 100, // Start at 100% happiness
			position: {
				x: Math.random() * (window.innerWidth - 100),
				y: Math.random() * (window.innerHeight - 100),
			},
			velocity: {
				dx: (Math.random() - 0.5) * 4,
				dy: (Math.random() - 0.5) * 4,
			},
		})),
	);

	const [gameOver, setGameOver] = useState(false);

	const handleGirlClick = useCallback((id: number) => {
		setGirls((prev) =>
			prev.map((girl) =>
				girl.id === id
					? { ...girl, angryLevel: Math.min(girl.angryLevel + 20, 100) }
					: girl,
			),
		);
	}, []);

	useEffect(() => {
		if (gameOver) return;

		const moveInterval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => {
					let newX = girl.position.x + girl.velocity.dx;
					let newY = girl.position.y + girl.velocity.dy;

					if (newX < 0 || newX > window.innerWidth - 100) {
						newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
						girl.velocity.dx *= -1;
					}
					if (newY < 0 || newY > window.innerHeight - 100) {
						newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
						girl.velocity.dy *= -1;
					}

					return {
						...girl,
						position: { x: newX, y: newY },
					};
				}),
			);
		}, 16);

		const angerInterval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => ({
					...girl,
					angryLevel: Math.max(girl.angryLevel - 8, 0),
				})),
			);
		}, 1000);

		return () => {
			clearInterval(moveInterval);
			clearInterval(angerInterval);
		};
	}, [gameOver]);

	useEffect(() => {
		if (girls.some((girl) => girl.angryLevel <= 0)) {
			setGameOver(true);
		}
	}, [girls]);

	return (
		<div
			className={cn("relative h-full w-full bg-gray-900", className)}
			{...props}
		>
			{showWarning && (
				<div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70">
					<div className="max-w-md rounded-lg bg-gray-800/90 p-6 text-center text-white shadow-xl">
						<h2 className="mb-4 font-bold text-2xl text-red-500">WARNING!</h2>
						<p className="text-lg">
							The goth girls demand your attention! Click on them to keep their
							anger levels down. If any girl's anger reaches maximum, it's GAME
							OVER!
						</p>
					</div>
				</div>
			)}
			{girls.map((girl) => {
				const asset = assets.find((a) => a.id === girl.id);
				if (!asset) return null;

				return (
					<div
						key={girl.id}
						className="absolute"
						style={{
							left: girl.position.x,
							top: girl.position.y,
						}}
					>
						<div className="relative">
							{/* Angry Level Bar */}
							<div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center">
								<div className="h-2 w-full rounded-full bg-gray-700/50">
									<div
										className={cn(
											"h-full rounded-full transition-all duration-300",
											girl.angryLevel >= 50
												? "bg-green-500/50"
												: "bg-red-500/50",
										)}
										style={{ width: `${girl.angryLevel}%` }}
									/>
								</div>
							</div>
							<button
								type="button"
								onClick={() => handleGirlClick(girl.id)}
								className="h-[100px] w-[100px] cursor-pointer select-none overflow-hidden rounded-xl transition-transform duration-300 hover:scale-110"
							>
								<img
									src={girl.angryLevel >= 50 ? asset.happy : asset.angry}
									alt="Goth girl"
									className="select-none"
									draggable="false"
								/>
							</button>
						</div>
					</div>
				);
			})}

			{gameOver && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50">
					<div className="font-bold text-4xl text-white">GAME OVER!</div>
				</div>
			)}
		</div>
	);
}
