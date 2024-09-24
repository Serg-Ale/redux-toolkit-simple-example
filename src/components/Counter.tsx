import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  decrement,
  fetchCounter,
  increment,
  reset,
} from "../store/counterSlice";

const Counter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const counter = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button
        onClick={() => {
          dispatch(increment());
        }}
      >
        Increment
      </button>

      <button
        onClick={() => {
          dispatch(decrement());
        }}
      >
        Decrement
      </button>

      <button
        onClick={() => {
          dispatch(reset());
        }}
      >
        Reset
      </button>

      <button
        onClick={() => {
          dispatch(fetchCounter());
        }}
      >
        {status === "loading" ? "Fetching..." : "Fetch Counter value"}
      </button>
      {status === "failed" && <p>Error fetching data</p>}
    </div>
  );
};

export default Counter;
