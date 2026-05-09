import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coins: 100,
  inventory: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCoins: (state, action) => {
      state.coins += action.payload;
    },
    deductCoins: (state, action) => {
      state.coins -= action.payload;
    },
    addToInventory: (state, action) => {
      const exists = state.inventory.find(item => item.id === action.payload.id);
      if (!exists) {
        state.inventory.push(action.payload);
      }
    },
    removeFromInventory: (state, action) => {
      state.inventory = state.inventory.filter(item => item.id !== action.payload);
    },
  },
});

export const { addCoins, deductCoins, addToInventory, removeFromInventory } = userSlice.actions;
export default userSlice.reducer;