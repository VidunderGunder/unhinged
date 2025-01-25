import type { ComponentProps } from "react";
import { cn } from "../../styles/utils";
import type { Message } from "./types";
import { motion, AnimatePresence } from "framer-motion";

type MessagesProps = {
	messages: Message[];
	handleReply: (id: number, correct: boolean) => void;
} & ComponentProps<"div">;

export function Messages({
	className,
	messages,
	handleReply,
	...props
}: MessagesProps) {
	return (
		<div
			className={cn(
				"pointer-events-none fixed right-0 bottom-0 left-0 z-30",
				className,
			)}
			{...props}
		>
			<AnimatePresence>
				{messages.length > 0 && (
					<motion.div
						initial={{ y: "100%", opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: "100%", opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="pointer-events-auto mx-auto h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[12px] border-gray-800 bg-gray-800 shadow-2xl"
					>
						{/* Screen Content */}
						<div className="relative h-full w-full overflow-hidden bg-gray-900">
							{/* Status Bar */}
							<div className="flex items-center justify-between px-4 pt-2 text-gray-400 text-xs">
								<span>9:41</span>
								<div className="flex items-center gap-1">
									<svg className="h-3 w-3" viewBox="0 0 16 16">
										<title>Status Bar</title>
										<path
											fill="currentColor"
											d="M14 8.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5z"
										/>
									</svg>
									<div className="h-2 w-4 rounded-sm border border-gray-400">
										<div className="h-full w-3/4 bg-gray-400" />
									</div>
								</div>
							</div>

							{/* Chat Content */}
							<div className="absolute inset-0 flex flex-col overflow-y-auto pt-4 pb-16">
								<div className="flex flex-1 flex-col justify-end gap-y-2 px-4">
									{messages.map((message) => (
										<motion.div
											key={message.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.9 }}
											className="w-full space-y-3"
										>
											{/* Girl's Message */}
											<div className="flex justify-start">
												<div className="relative max-w-[75%] rounded-2xl bg-gray-800 px-3.5 py-2 text-gray-100 text-sm shadow-md">
													<div className="-left-1 absolute top-3 h-2 w-3 rotate-45 transform bg-gray-800" />
													<div className="relative z-10">{message.text}</div>
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
													<motion.button
														key={reply.text}
														type="button"
														onClick={() =>
															handleReply(message.id, reply.correct)
														}
														className="group flex w-full justify-end"
														whileTap={{ scale: 0.95 }}
													>
														<div className="relative max-w-[75%] rounded-2xl bg-blue-600 px-3.5 py-2 text-left text-sm text-white shadow-md transition-all group-hover:bg-blue-700">
															<div className="-right-1 absolute top-3 h-2 w-3 rotate-45 transform bg-blue-600 group-hover:bg-blue-700" />
															<div className="relative z-10">{reply.text}</div>
														</div>
													</motion.button>
												))}
											</div>
										</motion.div>
									))}
								</div>
							</div>

							{/* Navigation Bar */}
							<div className="absolute right-0 bottom-0 left-0 h-12 bg-gray-800/90 backdrop-blur-sm">
								<div className="flex h-full items-center justify-around">
									<svg
										className="h-6 w-6 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Nav 1</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										/>
									</svg>
									<div className="h-1 w-8 rounded-full bg-gray-600" />
									<svg
										className="h-6 w-6 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Nav 2</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
