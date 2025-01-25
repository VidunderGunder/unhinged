export type RepliesMap = {
	[key: string]: {
		correct: string[];
		wrong: string;
	};
};

export const repliesMap: RepliesMap = {
	"Do you still love me? uwu": {
		correct: ["Of course I do! 💕", "You're my everything! 💖"],
		wrong: "Not really...",
	},
	"Why aren't you replying? >_<": {
		correct: ["I'm here now! 🤗", "Sorry, I was busy! 🥺"],
		wrong: "I was ignoring you.",
	},
	"Am I annoying you? ;_;": {
		correct: ["Not at all! ✨", "I love talking to you! 💞"],
		wrong: "Yes, you are.",
	},
	"You don't care anymore, do you? T_T": {
		correct: ["I care so much! 💝", "Never doubt that! 💗"],
		wrong: "Maybe I don't.",
	},
	"I guess I'm not important... :(": {
		correct: ["You're important! 💖", "You mean the world to me! 🌟"],
		wrong: "You're not.",
	},
};
