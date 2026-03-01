import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import { api } from '@/lib/api'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'isLoggedIn'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
