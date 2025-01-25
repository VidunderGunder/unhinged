import type { ComponentProps } from "react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "../../styles/utils";
import { repliesMap } from "./repliesMap";
import { assets } from "./assets";

type Message = {
	id: number;
	text: string;
	timeoutId: ReturnType<typeof setTimeout>;
	replies: { text: string; correct: boolean }[];
	startTime: number;
	timeLeft: number;
};

type GirlState = {
	id: number;
	angryLevel: number;
	position: { x: number; y: number };
	velocity: { dx: number; dy: number };
};

export type GameProps = ComponentProps<"div">;

export function Game({ className, ...props }: GameProps) {
	const [showWarning, setShowWarning] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [survivalTime, setSurvivalTime] = useState(0);
	const [highscores, setHighscores] = useState<number[]>([]);
	const [gameOver, setGameOver] = useState(false);

	const [girls, setGirls] = useState<GirlState[]>(() =>
		assets.map((asset) => ({
			id: asset.id,
			angryLevel: 100,
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

	// Load highscores
	useEffect(() => {
		const saved = localStorage.getItem("highscores");
		if (saved) setHighscores(JSON.parse(saved));
	}, []);

	// Survival timer
	useEffect(() => {
		if (gameOver) return;
		const interval = setInterval(() => {
			setSurvivalTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [gameOver]);

	// Message time left updates
	useEffect(() => {
		if (gameOver) return;
		const interval = setInterval(() => {
			setMessages((prev) =>
				prev.map((message) => ({
					...message,
					timeLeft: Math.max(
						0,
						100 - ((Date.now() - message.startTime) / 5000) * 100,
					),
				})),
			);
		}, 100);
		return () => clearInterval(interval);
	}, [gameOver]);

	// Game over handler
	useEffect(() => {
		if (gameOver) {
			const newHighscores = Array.from(new Set([...highscores, survivalTime]))
				.sort((a, b) => b - a)
				.slice(0, 10);
			localStorage.setItem("highscores", JSON.stringify(newHighscores));
			setHighscores(newHighscores);
		}
	}, [gameOver, highscores, survivalTime]);

	// Initial warning timer
	useEffect(() => {
		const timer = setTimeout(() => setShowWarning(false), 5000);
		return () => clearTimeout(timer);
	}, []);

	const getReplies = useCallback((messageText: string) => {
		const { correct, wrong } = repliesMap[messageText];
		return [...correct, wrong]
			.sort(() => Math.random() - 0.5)
			.map((text) => ({
				text,
				correct: correct.includes(text),
			}));
	}, []);

	// Message generation
	useEffect(() => {
		if (gameOver) return;

		const messageInterval = setInterval(
			() => {
				const messageTexts = Object.keys(repliesMap);
				const text =
					messageTexts[Math.floor(Math.random() * messageTexts.length)];
				const id = Date.now();
				const timeoutId = setTimeout(() => setGameOver(true), 5000);
				const replies = getReplies(text);

				setMessages((prev) => [
					...prev,
					{
						id,
						text,
						timeoutId,
						replies,
						startTime: Date.now(),
						timeLeft: 100,
					},
				]);
			},
			Math.random() * 15 * 1000 + 7.5 * 1000,
		);

		return () => clearInterval(messageInterval);
	}, [gameOver, getReplies]);

	// Reply handling
	// Reply handling
	const handleReply = useCallback((id: number, correct: boolean) => {
		if (!correct) {
			setGameOver(true);
			return;
		}

		setMessages((prev) => {
			// Clear the timeout before removing the message
			const message = prev.find((m) => m.id === id);
			if (message) clearTimeout(message.timeoutId);
			return prev.filter((m) => m.id !== id);
		});

		setGirls((prev) =>
			prev.map((girl) => ({
				...girl,
				angryLevel: Math.min(girl.angryLevel + 10, 100),
			})),
		);
	}, []);

	// Girl clicking
	const handleGirlClick = useCallback((id: number) => {
		setGirls((prev) =>
			prev.map((girl) =>
				girl.id === id
					? { ...girl, angryLevel: Math.min(girl.angryLevel + 20, 100) }
					: girl,
			),
		);
	}, []);

	// Movement system
	useEffect(() => {
		if (gameOver) return;

		const moveInterval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => {
					const speedMultiplier = 1 + (100 - girl.angryLevel) / 100;
					let newX = girl.position.x + girl.velocity.dx * speedMultiplier;
					let newY = girl.position.y + girl.velocity.dy * speedMultiplier;

					if (newX < 0 || newX > window.innerWidth - 100) {
						newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
						girl.velocity.dx = (Math.random() - 0.5) * 4 * speedMultiplier;
					}
					if (newY < 0 || newY > window.innerHeight - 100) {
						newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
						girl.velocity.dy = (Math.random() - 0.5) * 4 * speedMultiplier;
					}

					return { ...girl, position: { x: newX, y: newY } };
				}),
			);
		}, 16);

		return () => clearInterval(moveInterval);
	}, [gameOver]);

	// Anger system
	useEffect(() => {
		if (gameOver) return;
		const angerInterval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => ({
					...girl,
					angryLevel: Math.max(girl.angryLevel - 8, 0),
				})),
			);
		}, 1000);
		return () => clearInterval(angerInterval);
	}, [gameOver]);

	// Game over check
	useEffect(() => {
		if (girls.some((girl) => girl.angryLevel <= 0)) setGameOver(true);
	}, [girls]);

	return (
		<div
			className={cn("u relative h-full w-full bg-gray-900", className)}
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

			{/* Survival Timer */}
			<div className="fixed top-4 left-4 z-30 select-none font-bold text-white text-xl">
				Time: {Math.floor(survivalTime / 60)}:
				{String(survivalTime % 60).padStart(2, "0")}
			</div>

			{girls.map((girl) => {
				const asset = assets.find((a) => a.id === girl.id);
				if (!asset) return null;

				return (
					<div
						key={girl.id}
						className="absolute"
						style={{ left: girl.position.x, top: girl.position.y }}
					>
						<div className="relative">
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

			{/* Messages */}
			<div className="fixed right-0 bottom-0 left-0 z-30 flex flex-col items-center space-y-2 p-4">
				{messages.map((message) => (
					<div key={message.id} className="w-full max-w-md space-y-3 px-4">
						{/* Girl's Message */}
						<div className="flex justify-start">
							<div className="relative max-w-[85%] rounded-xl bg-gray-800 p-3 text-sm text-white shadow-md">
								{/* Chat bubble tail */}
								<div className="-left-1.5 absolute top-3 h-3 w-3 rotate-45 transform bg-gray-800" />
								<div className="relative z-10">{message.text}</div>

								{/* Time progress bar */}
								<div className="-bottom-1 absolute right-0 left-0 h-1 rounded-full bg-gray-700">
									<div
										className="h-full rounded-full bg-blue-500 transition-all duration-100"
										style={{ width: `${message.timeLeft}%` }}
									/>
								</div>
							</div>
						</div>

						{/* User Replies */}
						<div className="space-y-2">
							{message.replies.map((reply) => (
								<button
									key={reply.text}
									type="button"
									onClick={() => handleReply(message.id, reply.correct)}
									className="flex w-full justify-end"
								>
									<div className="relative max-w-[85%] rounded-xl bg-blue-600 p-3 text-sm text-white shadow-md transition-colors hover:bg-blue-700">
										{/* Chat bubble tail */}
										<div className="-right-1.5 absolute top-3 h-3 w-3 rotate-45 transform bg-blue-600" />
										<div className="relative z-10">{reply.text}</div>
									</div>
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Game Over Screen */}
			{gameOver && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-center">
						<div className="s mb-4 select-none font-bold text-4xl text-white">
							GAME OVER!
						</div>
						<div className="mb-4 select-none text-white text-xl">
							Survived: {Math.floor(survivalTime / 60)}:
							{String(survivalTime % 60).padStart(2, "0")}
						</div>
						<div className="mb-2 text-lg text-white">High Scores:</div>
						<div className="select-none space-y-1">
							{highscores.map((score, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <meh>
								<div key={index} className="text-white">
									{index + 1}. {Math.floor(score / 60)}:
									{String(score % 60).padStart(2, "0")}
								</div>
							))}
						</div>
						<button
							type="button"
							onClick={() => {
								setGameOver(false);
								setSurvivalTime(0);
								setMessages([]);
								setGirls(
									assets.map((asset) => ({
										id: asset.id,
										angryLevel: 100,
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
							}}
							className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
						>
							Restart Game
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
