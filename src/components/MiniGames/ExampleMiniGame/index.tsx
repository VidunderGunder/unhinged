// src/components/MiniGames/ExampleMiniGame/index.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MiniGameProps } from "../types";

export function ExampleMiniGame({ onComplete, difficulty }: MiniGameProps) {
	const [clicksRequired] = useState(Math.floor(3 + difficulty * 2));
	const [clicks, setClicks] = useState(0);
	const [timeLeft, setTimeLeft] = useState(5);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		if (completed) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setCompleted(true);
					onComplete("fail");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [onComplete, completed]);

	const handleClick = () => {
		if (completed) return;

		const newClicks = clicks + 1;
		setClicks(newClicks);

		if (newClicks >= clicksRequired) {
			setCompleted(true);
			onComplete("success");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
			<div className="relative rounded-xl border-4 border-purple-900 bg-gray-950 p-8 text-center">
				<h2 className="mb-4 font-mono text-2xl text-purple-400">
					CLICK OR DIE! 💀
				</h2>
				<p className="mb-4 text-white">
					{clicksRequired - clicks} MORE EDGY CLICKS NEEDED
				</p>

				<motion.button
					whileHover={{ scale: completed ? 1 : 1.1 }}
					whileTap={{ scale: completed ? 1 : 0.9 }}
					onClick={handleClick}
					disabled={completed}
					className="rounded-lg bg-purple-600 px-6 py-3 font-bold text-white disabled:opacity-50"
				>
					{completed ? "⏳ PROCESSING..." : `💀 CLICK ME ${clicks} 💀`}
				</motion.button>

				<div className="mt-4 text-purple-300">
					TIME LEFT: {timeLeft}s{completed && " - GAME COMPLETED!"}
				</div>
			</div>
		</div>
	);
}
