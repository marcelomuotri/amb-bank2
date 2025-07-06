import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/authSlice'
import { api } from './api'

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Agregar el middleware de tu RTK Query API
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store