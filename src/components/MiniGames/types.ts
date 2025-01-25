export type MiniGameOutcome = "success" | "fail" | "abandoned";
export type MiniGameProps = {
	onComplete: (result: MiniGameOutcome) => void;
	difficulty: number;
};

export type MiniGame = {
	name: string;
	component: React.ComponentType<MiniGameProps>;
	difficultyRange: [number, number];
};
