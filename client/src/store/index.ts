import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { persistStore, persistReducer } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

//export type AppDispatch = typeof store.dispatch;


export const persistor = persistStore(store);
export default store;