// Rotating entrepreneur quotes shown on the idle screen when no idle
// YouTube video is configured.
export type IdleQuote = { text: string; author: string };

export const ENTREPRENEUR_QUOTES: IdleQuote[] = [
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "It's fine to celebrate success but it is more important to heed the lessons of failure.", author: "Bill Gates" },
  { text: "Business opportunities are like buses, there's always another one coming.", author: "Richard Branson" },
  { text: "Do not be embarrassed by your failures, learn from them and start again.", author: "Richard Branson" },
  { text: "If you don't build your dream, someone else will hire you to help them build theirs.", author: "Tony Gaskins" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "I never dreamed about success. I worked for it.", author: "Estée Lauder" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Chase the vision, not the money; the money will end up following you.", author: "Tony Hsieh" },
  { text: "Build something 100 people love, not something 1 million people kind of like.", author: "Brian Chesky" },
  { text: "If you are not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman" },
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
];

// Picks a random index, avoiding an immediate repeat of `exclude`.
export function randomQuoteIndex(exclude?: number): number {
  if (ENTREPRENEUR_QUOTES.length <= 1) return 0;
  let next = Math.floor(Math.random() * ENTREPRENEUR_QUOTES.length);
  if (next === exclude) next = (next + 1) % ENTREPRENEUR_QUOTES.length;
  return next;
}
