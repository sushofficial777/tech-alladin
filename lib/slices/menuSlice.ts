import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuState {
  isMenuOpen: boolean;
  color: 'Dark' | 'Light';
}

const initialState: MenuState = {
  isMenuOpen: false,
  color: 'Dark',
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<{ isMenuOpen: boolean; color?: 'Dark' | 'Light' }>) => {
      state.isMenuOpen = action.payload.isMenuOpen;
      if (action.payload.color) {
        state.color = action.payload.color;
      }
    },
    setMenuColor: (state, action: PayloadAction<'Dark' | 'Light'>) => {
      state.color = action.payload;
    },
  },
});

export const { toggleMenu, setMenuColor } = menuSlice.actions;
export default menuSlice.reducer;
