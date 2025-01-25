export type Message = {
	id: number;
	text: string;
	timeoutId: ReturnType<typeof setTimeout>;
	replies: { text: string; correct: boolean }[];
	startTime: number;
	timeLeft: number;
};

export type GirlState = {
	id: number;
	happiness: number;
	position: { x: number; y: number };
	velocity: { dx: number; dy: number };
};
