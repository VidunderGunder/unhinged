import type { ComponentProps } from "react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "../styles/utils";

interface Message {
	id: number;
	text: string;
	timeoutId: ReturnType<typeof setTimeout>;
	response?: string;
	showResponse?: boolean;
}

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
	const [messages, setMessages] = useState<Message[]>([]);

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

	// Clear message timeouts when game over
	useEffect(() => {
		if (gameOver) {
			messages.forEach((message) => clearTimeout(message.timeoutId));
			setMessages([]);
		}
	}, [gameOver, messages]);

	// Generate random messages
	useEffect(() => {
		if (gameOver) return;

		const messageInterval = setInterval(
			() => {
				const messageTexts = [
					"Do you still love me? uwu",
					"Why aren't you replying? >_<",
					"Am I annoying you? ;_;",
					"You don't care anymore, do you? T_T",
					"I guess I'm not important... :(",
				];
				const text =
					messageTexts[Math.floor(Math.random() * messageTexts.length)];
				const id = Date.now();

				const timeoutId = setTimeout(() => {
					setGameOver(true);
				}, 5000);

				setMessages((prev) => [...prev, { id, text, timeoutId }]);
			},
			Math.random() * 20000 + 10000,
		); // 10-30 seconds

		return () => clearInterval(messageInterval);
	}, [gameOver]);

	// Handle message reply
	const handleReply = useCallback((id: number) => {
		setMessages((prev) => {
			const message = prev.find((m) => m.id === id);
			if (!message) return prev;

			if (message.showResponse) {
				clearTimeout(message.timeoutId);
				return prev.filter((m) => m.id !== id);
			}

			const responses = {
				"Do you still love me? uwu":
					"Of course I do! You're very special to me! 💕",
				"Why aren't you replying? >_<":
					"I'm here now! Sorry for making you wait! 🤗",
				"Am I annoying you? ;_;": "Not at all! I enjoy talking with you! ✨",
				"You don't care anymore, do you? T_T":
					"I care about you very much! Don't think that way! 💝",
				"I guess I'm not important... :(":
					"You're absolutely important to me! Never doubt that! 💖",
			};

			const updatedMessages = prev.map((m) => {
				if (m.id === id) {
					clearTimeout(m.timeoutId);
					const newTimeoutId = setTimeout(() => {
						setMessages((current) => current.filter((cm) => cm.id !== id));
					}, 3000);
					return {
						...m,
						response: responses[m.text as keyof typeof responses],
						showResponse: true,
						timeoutId: newTimeoutId,
					};
				}
				return m;
			});

			return updatedMessages;
		});
	}, []);

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

			{/* Messages display */}
			<div className="fixed right-0 bottom-0 left-0 z-30 flex flex-col items-center space-y-2 p-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className="flex flex-col space-y-2 rounded-lg bg-gray-800 p-3 text-white shadow-lg"
					>
						<div className="flex items-center space-x-3">
							<span className="text-sm">{message.text}</span>
							<button
								type="button"
								onClick={() => handleReply(message.id)}
								className="rounded bg-blue-500 px-3 py-1 text-sm transition-colors hover:bg-blue-600"
							>
								{message.showResponse ? "Dismiss" : "Reply"}
							</button>
						</div>
						{message.showResponse && (
							<div className="animate-fade-in text-green-400 text-sm">
								{message.response}
							</div>
						)}
					</div>
				))}
			</div>

			{gameOver && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50">
					<div className="font-bold text-4xl text-white">GAME OVER!</div>
				</div>
			)}
		</div>
	);
}
