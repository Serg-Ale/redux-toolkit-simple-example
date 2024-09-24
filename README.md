### Case Study: Counter App with Redux Toolkit

#### Objective:

Build a **Counter** application where the counter value can be incremented, decremented, reset, and fetched from a mock API.

You will:

- Use **Redux Toolkit** for managing global state.
- Handle **synchronous** actions (increment, decrement, reset).
- Handle an **asynchronous** action (fetch counter value from a mock API).
- Use **TypeScript** for type safety.

---

### 1. Set Up Redux Toolkit

1. **Install Redux Toolkit** and **React Redux**:

   In your Vite React project, run:

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. **Create the Redux Store**

   In the `src/store` directory, create a `store.ts` file:

   ```ts
   import { configureStore } from "@reduxjs/toolkit";
   import counterReducer from "./counterSlice";

   export const store = configureStore({
     reducer: {
       counter: counterReducer,
     },
   });

   // Define types for the root state and dispatch
   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   ```

### 2. Create a Redux Slice

1. Create a slice file in `src/store/counterSlice.ts`:

   ```ts
   import {
     createSlice,
     PayloadAction,
     createAsyncThunk,
   } from "@reduxjs/toolkit";

   interface CounterState {
     value: number;
     status: "idle" | "loading" | "failed";
   }

   const initialState: CounterState = {
     value: 0,
     status: "idle",
   };

   // Asynchronous thunk action to simulate API call
   export const fetchCounter = createAsyncThunk(
     "counter/fetchCounter",
     async () => {
       const response = await new Promise<{ data: number }>((resolve) => {
         setTimeout(() => resolve({ data: 10 }), 1000); // Mock API delay
       });
       return response.data;
     }
   );

   const counterSlice = createSlice({
     name: "counter",
     initialState,
     reducers: {
       increment: (state) => {
         state.value += 1;
       },
       decrement: (state) => {
         state.value -= 1;
       },
       reset: (state) => {
         state.value = 0;
       },
     },
     extraReducers: (builder) => {
       builder
         .addCase(fetchCounter.pending, (state) => {
           state.status = "loading";
         })
         .addCase(
           fetchCounter.fulfilled,
           (state, action: PayloadAction<number>) => {
             state.status = "idle";
             state.value = action.payload;
           }
         )
         .addCase(fetchCounter.rejected, (state) => {
           state.status = "failed";
         });
     },
   });

   export const { increment, decrement, reset } = counterSlice.actions;
   export default counterSlice.reducer;
   ```

### 3. Set Up the Redux Provider

Wrap your application with the Redux `Provider` in `main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 4. Create Counter Component

Create a `Counter.tsx` component in the `src/components` directory:

```tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  increment,
  decrement,
  reset,
  fetchCounter,
} from "../store/counterSlice";

const Counter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const counter = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <button onClick={() => dispatch(fetchCounter())}>
        {status === "loading" ? "Fetching..." : "Fetch Counter Value"}
      </button>
      {status === "failed" && <p>Error fetching data</p>}
    </div>
  );
};

export default Counter;
```

### 5. Use Counter in App Component

In your `src/App.tsx` file:

```tsx
import React from "react";
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">
      <h1>Redux Toolkit Counter</h1>
      <Counter />
    </div>
  );
}

export default App;
```

---

### 6. TypeScript Types Explained

- **RootState**: This represents the entire state of your Redux store. You use this type in `useSelector` to get typed access to the global state.
- **AppDispatch**: The type of the `dispatch` function, ensuring that the dispatched actions are typed.

### 7. Running the Application

After setting everything up, run your application using:

```bash
npm run dev
```

Now you have a fully functional counter app that uses Redux Toolkit for state management and includes both synchronous and asynchronous actions.
