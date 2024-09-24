import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      setTimeout(() => {
        resolve({ data: 10 });
      }, 1000);
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
