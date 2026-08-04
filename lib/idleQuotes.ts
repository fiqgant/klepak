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
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Your brand is what other people say about you when you're not in the room.", author: "Jeff Bezos" },
  { text: "If you double the number of experiments you do per year, you're going to double your inventiveness.", author: "Jeff Bezos" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "Persistence is very important. You should not give up unless you are forced to give up.", author: "Elon Musk" },
  { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
  { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
  { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
  { text: "Failure is not the opposite of success; it's part of success.", author: "Arianna Huffington" },
  { text: "Work like there is someone working 24 hours a day to take it away from you.", author: "Mark Cuban" },
  { text: "Never give up. Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.", author: "Jack Ma" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "Always deliver more than expected.", author: "Larry Page" },
  { text: "If you don't design your own life plan, chances are you'll fall into someone else's plan.", author: "Jim Rohn" },
  { text: "Don't be intimidated by what you don't know. That can be your greatest strength.", author: "Sara Blakely" },
  { text: "Success is best when it's shared.", author: "Howard Schultz" },
  { text: "In order to be irreplaceable one must always be different.", author: "Coco Chanel" },
];

// Picks a random index, avoiding an immediate repeat of `exclude`.
export function randomQuoteIndex(exclude?: number): number {
  if (ENTREPRENEUR_QUOTES.length <= 1) return 0;
  let next = Math.floor(Math.random() * ENTREPRENEUR_QUOTES.length);
  if (next === exclude) next = (next + 1) % ENTREPRENEUR_QUOTES.length;
  return next;
}
