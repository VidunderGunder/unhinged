// src/components/MiniGames/SSRiMiniGame/index.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MiniGameProps } from "./types";
import { assets } from "../Game/assets";

const ssris = ["💊 Prozac", "💊 Zoloft", "💊 Lexapro", "💊 Paxil", "💊 Celexa"];
const wrongMeds = [
	"🍄 Shrooms",
	"💊 Xanax",
	"💉 Heroin",
	"❔ Molly",
	"💊 Adderall",
	"💊 Oxy",
	"🥃 Whiskey",
];

export function SSRiMiniGame({ onComplete, difficulty }: MiniGameProps) {
	const [girl] = useState(
		() => assets[Math.floor(Math.random() * assets.length)],
	);
	const [required] = useState(1);
	const [score, setScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState(10);
	const [pills, setPills] = useState<
		{ id: string; label: string; correct: boolean; clicked: boolean }[]
	>(() => {
		const correct = ssris
			.sort(() => Math.random() - 0.5)
			.slice(0, 1)
			.map((label) => ({
				id: Math.random().toString(),
				label,
				correct: true,
				clicked: false,
			}));

		const wrong = wrongMeds
			.sort(() => Math.random() - 0.5)
			.slice(0, 5 + difficulty)
			.map((label) => ({
				id: Math.random().toString(),
				label,
				correct: false,
				clicked: false,
			}));

		return [...correct, ...wrong].sort(() => Math.random() - 0.5);
	});

	useEffect(() => {
		if (score >= required || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					onComplete("fail");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, score, required, onComplete]);

	const handleClick = (id: string, isCorrect: boolean) => {
		if (timeLeft <= 0 || score >= required) return;

		setPills((prev) =>
			prev.map((pill) => (pill.id === id ? { ...pill, clicked: true } : pill)),
		);

		if (!isCorrect) {
			onComplete("fail");
			return;
		}

		setScore(1);
		onComplete("success");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
			<div className="relative min-w-[300px] rounded-xl border-4 border-purple-900 bg-gray-950 p-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-4">
					<img
						src={girl.happy}
						alt={girl.name}
						className="h-16 w-16 rounded-full border-2 border-purple-500 object-cover"
					/>
					<div className="text-lg text-purple-200">
						Help {girl.name} find her SSRI!
					</div>
				</div>

				<div className="mb-4 text-white">
					<p>Time Left: {timeLeft}s</p>
					{score >= required && (
						<p className="text-green-400">CORRECT MEDICATION!</p>
					)}
					{timeLeft <= 0 && (
						<p className="text-red-400">{girl.name} got more depressed!</p>
					)}
				</div>

				<div className="mb-4 grid grid-cols-2 gap-3">
					{pills.map((pill) => (
						<motion.button
							key={pill.id}
							disabled={pill.clicked || timeLeft <= 0 || score >= required}
							onClick={() => handleClick(pill.id, pill.correct)}
							initial={{ scale: 1 }}
							animate={{
								scale: pill.clicked ? 0.9 : 1,
								backgroundColor: pill.clicked
									? pill.correct
										? "#4ade80"
										: "#f87171"
									: "#1f2937",
							}}
							className="rounded-lg p-2 font-medium text-sm text-white disabled:opacity-50"
							whileHover={!pill.clicked ? { scale: 1.1 } : undefined}
							whileTap={!pill.clicked ? { scale: 0.9 } : undefined}
						>
							{pill.label}
						</motion.button>
					))}
				</div>

				<p className="text-gray-400 text-sm">
					Wrong choice will make {girl.name} worse!
				</p>
			</div>
		</div>
	);
}
