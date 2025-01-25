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
		correct: ["I care so much! 💝", "Always will! 💗"],
		wrong: "Maybe I don't.",
	},
	"I guess I'm not important... :(": {
		correct: ["You're important! 💖", "You mean the world to me! 🌟"],
		wrong: "You're not.",
	},
	"You still simp for me? 🥺👉👈": {
		correct: [
			"I'd sell my GPU for your OF 💻🔥",
			"I'd trade my WoW mount for your bathwater 🐉🚿",
		],
		wrong: "Why are you texting me?", // Add a funnier reply here
	},
	"Are you cheating on me? 😭": {
		correct: [
			"Never! You're my one and only! 💘",
			"I only have eyes for you! 😍",
		],
		wrong: "Maybe.",
	},
	"Do you think I'm cute? 🥺": {
		correct: ["The cutest! 😊", "Absolutely adorable! 🥰"],
		wrong: "Depends",
	},
	"Would you leave me for someone else? 💔": {
		correct: ["I'd never leave you! 💞", "You're stuck with me forever! 💖"],
		wrong: "Depends on who.",
	},
	"Are we still dating? 😟": {
		correct: ["Of course! 💕", "Forever and always! 💓"],
		wrong: "I don't know.",
	},
	"You're getting bored of me, aren't you? 😞": {
		correct: ["Never! 💝", "Every moment with you is exciting! ✨"],
		wrong: "A little.",
	},
	"Do you miss me when I'm gone? 😢": {
		correct: ["Every second! 💖", "Can't wait to meet! 💟"],
		wrong: "Not really.",
	},
	"Am I your favorite person? 🥰": {
		correct: ["You're my everything! 💗", "No one else compares! 💞"],
		wrong: "Top three! 💘",
	},
	"Am I too clingy? 😣": {
		correct: ["I love your attention! 💖", "Never too clingy for me! <3"],
		wrong: "Sometimes you can be 💞",
	},
};
