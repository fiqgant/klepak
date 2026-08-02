"use client";

import { formatTimeDigits } from "@/lib/date";

function DigitGroup({ value }: { value: string }) {
  return (
    <div className="flex gap-2 sm:gap-3">
      {value.split("").map((digit, i) => (
        <span
          key={i}
          className="flap-cell w-[1.1em] h-[1.4em] text-[3.5rem] leading-none font-heading sm:text-[6rem] lg:text-[8rem]"
        >
          {digit}
        </span>
      ))}
    </div>
  );
}

export default function SplitFlapClock({ now }: { now: Date }) {
  const { hours, minutes, seconds } = formatTimeDigits(now);

  return (
    <div className="flex items-center justify-center gap-3 text-foreground sm:gap-4">
      <DigitGroup value={hours} />
      <span className="pb-4 text-[3.5rem] font-heading sm:text-[6rem] lg:text-[8rem]">
        :
      </span>
      <DigitGroup value={minutes} />
      <span className="pb-4 text-[3.5rem] font-heading sm:text-[6rem] lg:text-[8rem]">
        :
      </span>
      <DigitGroup value={seconds} />
    </div>
  );
}
