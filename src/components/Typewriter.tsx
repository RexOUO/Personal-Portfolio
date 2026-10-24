import { useEffect, useState } from 'react';

interface Props {
  words: string[];
  reducedMotion: boolean;
  typeSpeed?: number; // ms per letter
  deleteSpeed?: number; // ms per letter
  holdTime?: number; // ms the full word stays on screen
}

/** Types each word letter by letter, holds it, deletes it, then moves to the next. */
export function Typewriter({
  words,
  reducedMotion,
  typeSpeed = 85,
  deleteSpeed = 45,
  holdTime = 2500,
}: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reducedMotion ? words[0] : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    // With "reduce motion" on, just swap whole words every few seconds.
    if (reducedMotion) {
      setText(word);
      const t = window.setTimeout(() => setIndex((i) => i + 1), holdTime);
      return () => window.clearTimeout(t);
    }

    let delay: number;
    let next: () => void;

    if (!deleting && text === word) {
      delay = holdTime;
      next = () => setDeleting(true);
    } else if (deleting && text === '') {
      delay = 350;
      next = () => {
        setDeleting(false);
        setIndex((i) => i + 1);
      };
    } else if (deleting) {
      delay = deleteSpeed;
      next = () => setText(word.slice(0, text.length - 1));
    } else {
      delay = typeSpeed;
      next = () => setText(word.slice(0, text.length + 1));
    }

    const t = window.setTimeout(next, delay);
    return () => window.clearTimeout(t);
  }, [text, deleting, index, words, reducedMotion, typeSpeed, deleteSpeed, holdTime]);

  return (
    <p className="role" aria-live="off">
      {/* Screen readers get the full list once instead of letter-by-letter noise */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">
        {text}
        <span className="caret">|</span>
      </span>
    </p>
  );
}
