import type { ComponentProps } from "react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "../../styles/utils";
import { repliesMap } from "./repliesMap";
import { assets } from "./assets";
import type { GirlState, Message } from "./types";
import { Messages } from "./Messages";
import type { MiniGameOutcome } from "../MiniGames/types";
import { ExampleMiniGame } from "../MiniGames/ExampleMiniGame";

export type GameProps = ComponentProps<"div">;

export function Game({ className, ...props }: GameProps) {
	const [showWarning, setShowWarning] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [survivalTime, setSurvivalTime] = useState(0);
	const [highscores, setHighscores] = useState<number[]>([]);
	const [gameOver, setGameOver] = useState(false);
	const [isMiniGameActive, setIsMiniGameActive] = useState(false);
	const [currentMiniGame, setCurrentMiniGame] =
		useState<React.ReactElement | null>(null);
	const [miniGameResult, setMiniGameResult] = useState<MiniGameOutcome | null>(
		null,
	);

	const [activeGirlIds, setActiveGirlIds] = useState([1, 2]);
	const [isPlaying, setIsPlaying] = useState(false);

	const [girls, setGirls] = useState<GirlState[]>(() =>
		assets
			.filter((asset) => activeGirlIds.includes(asset.id))
			.map((asset) => ({
				id: asset.id,
				happiness: 100,
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

	// Minigame trigger system
	useEffect(() => {
		if (!isPlaying || gameOver || isMiniGameActive) return;

		// Trigger every 60 seconds (corrected from %10 to %60)
		if (survivalTime > 0 && survivalTime % 30 === 0) {
			setIsMiniGameActive(true);
			setCurrentMiniGame(
				<ExampleMiniGame
					onComplete={(result) => {
						setIsMiniGameActive(false);
						setMiniGameResult(result);
						setCurrentMiniGame(null);
						// Always increment time to prevent retrigger
						setSurvivalTime((prev) => prev + 1); // Add this line
					}}
					difficulty={Math.floor(survivalTime / 60)}
				/>,
			);
		}
	}, [survivalTime, isPlaying, gameOver, isMiniGameActive]);

	// Minigame outcome handler
	useEffect(() => {
		if (!miniGameResult) return;

		if (miniGameResult === "success") {
			setGirls((prev) =>
				prev.map((girl) => ({
					...girl,
					happiness: Math.min(girl.happiness + 20, 100),
				})),
			);
		} else {
			if (!gameOver) setGameOver(true);
		}

		setMiniGameResult(null);
	}, [miniGameResult, gameOver]);

	// Highscore loader
	useEffect(() => {
		const saved = localStorage.getItem("highscores");
		if (saved) setHighscores(JSON.parse(saved));
	}, []);

	// New girl adder
	useEffect(() => {
		if (!isPlaying || gameOver || isMiniGameActive) return;
		if (survivalTime > 0 && survivalTime % 30 === 0) {
			setActiveGirlIds((prev) => {
				if (prev.length >= assets.length) return prev;
				const nextId = assets[prev.length].id;
				return [...prev, nextId];
			});
		}
	}, [survivalTime, gameOver, isPlaying, isMiniGameActive]);

	// Girl state updater
	useEffect(() => {
		const currentGirlIds = girls.map((g) => g.id);
		const newIds = activeGirlIds.filter((id) => !currentGirlIds.includes(id));

		if (newIds.length === 0) return;

		const newGirls = newIds
			.map((id) => {
				const asset = assets.find((a) => a.id === id);
				return asset
					? {
							id: asset.id,
							happiness: 100,
							position: {
								x: Math.random() * (window.innerWidth - 100),
								y: Math.random() * (window.innerHeight - 100),
							},
							velocity: {
								dx: (Math.random() - 0.5) * 4,
								dy: (Math.random() - 0.5) * 4,
							},
						}
					: null;
			})
			.filter(Boolean) as GirlState[];

		setGirls((prev) => [...prev, ...newGirls]);
	}, [activeGirlIds, girls]);

	// Survival timer
	useEffect(() => {
		if (gameOver || !isPlaying || isMiniGameActive) return;
		const interval = setInterval(() => {
			setSurvivalTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [gameOver, isPlaying, isMiniGameActive]);

	// Message timer
	useEffect(() => {
		if (gameOver || !isPlaying || isMiniGameActive) return;
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
	}, [gameOver, isPlaying, isMiniGameActive]);

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

	const getReplies = useCallback((messageText: string) => {
		const { correct, wrong } = repliesMap[messageText];
		return [...correct, wrong]
			.sort(() => Math.random() - 0.5)
			.map((text) => ({
				text,
				correct: correct.includes(text),
			}));
	}, []);

	// Message generator
	useEffect(() => {
		if (gameOver || !isPlaying || isMiniGameActive) return;

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
	}, [gameOver, getReplies, isPlaying, isMiniGameActive]);

	// Reply handler
	const handleReply = useCallback((id: number, correct: boolean) => {
		if (!correct) {
			setGameOver(true);
			return;
		}

		setMessages((prev) => {
			const message = prev.find((m) => m.id === id);
			if (message) clearTimeout(message.timeoutId);
			return prev.filter((m) => m.id !== id);
		});

		setGirls((prev) =>
			prev.map((girl) => ({
				...girl,
				happiness: Math.min(girl.happiness + 10, 100),
			})),
		);
	}, []);

	// Girl click handler
	const handleGirlClick = useCallback((id: number) => {
		setGirls((prev) =>
			prev.map((girl) =>
				girl.id === id
					? { ...girl, happiness: Math.min(girl.happiness + 20, 100) }
					: girl,
			),
		);
	}, []);

	// Movement system
	useEffect(() => {
		if (gameOver || !isPlaying || isMiniGameActive) return;

		const moveInterval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => {
					const speedMultiplier = 1 + (100 - girl.happiness) / 100;
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
	}, [gameOver, isPlaying, isMiniGameActive]);

	// Happiness depletion
	useEffect(() => {
		if (gameOver || !isPlaying || isMiniGameActive) return;
		const interval = setInterval(() => {
			setGirls((prev) =>
				prev.map((girl) => ({
					...girl,
					happiness: Math.max(girl.happiness - 8, 0),
				})),
			);
		}, 1000);
		return () => clearInterval(interval);
	}, [gameOver, isPlaying, isMiniGameActive]);

	// Game over check
	useEffect(() => {
		if (girls.some((girl) => girl.happiness <= 0)) setGameOver(true);
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
							happiness up. If any girl's happiness reaches zero, it's GAME
							OVER!
						</p>
						<button
							type="button"
							onClick={() => {
								setShowWarning(false);
								setIsPlaying(true);
							}}
							className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
						>
							Begin
						</button>
					</div>
				</div>
			)}

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
											girl.happiness >= 50
												? "bg-green-500/50"
												: "bg-red-500/50",
										)}
										style={{ width: `${girl.happiness}%` }}
									/>
								</div>
							</div>
							<button
								type="button"
								onClick={() => handleGirlClick(girl.id)}
								className="h-[100px] w-[100px] cursor-pointer select-none overflow-hidden rounded-xl transition-transform duration-300 hover:scale-110"
							>
								<img
									src={girl.happiness >= 50 ? asset.happy : asset.angry}
									alt="Goth girl"
									className={cn(
										"h-full w-full select-none object-cover",
										girl.happiness < 20 && "animate-shake",
									)}
									draggable="false"
								/>
							</button>
						</div>
					</div>
				);
			})}

			<Messages messages={messages} handleReply={handleReply} />

			{gameOver && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-center">
						<div className="mb-4 select-none font-bold text-4xl text-white">
							GAME OVER!
						</div>
						<div className="mb-4 select-none text-white text-xl">
							Survived: {Math.floor(survivalTime / 60)}:
							{String(survivalTime % 60).padStart(2, "0")}
						</div>
						<div className="mb-2 text-lg text-white">High Scores:</div>
						<div className="select-none space-y-1">
							{highscores.map((score, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <It's okay>
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
								setActiveGirlIds([1, 2]);
								setGirls(
									assets
										.filter((a) => [1, 2].includes(a.id))
										.map((asset) => ({
											id: asset.id,
											happiness: 100,
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

			{currentMiniGame}

			{isMiniGameActive && (
				<div className="fixed top-4 right-4 z-50 rounded-lg bg-purple-900/90 p-3 text-sm text-white">
					MINIGAME ACTIVE! 🔥
				</div>
			)}
		</div>
	);
}
