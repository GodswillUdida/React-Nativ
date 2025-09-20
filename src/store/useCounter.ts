import { useState } from "react";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useCounter = (): CounterState => {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    return { count, increment, decrement };
};