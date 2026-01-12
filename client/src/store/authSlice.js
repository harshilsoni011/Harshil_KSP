import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { kspAPI, setAuthToken } from "../utils/api";
import { API_MESSAGES } from "../utils/constants";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

let parsedUser = null;
try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch {
  parsedUser = null;
}

if (storedToken) {
  setAuthToken(storedToken);
}

const initialState = {
  user: parsedUser,
  token: storedToken || null,
  isAuthenticated: !!(storedToken && parsedUser),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ credentials }, { rejectWithValue }) => {
    try {
      const response = await kspAPI.login(credentials);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(token);

      toast.success(API_MESSAGES.SUCCESS.LOGIN);
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.error || API_MESSAGES.ERROR.LOGIN_FAILED;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    toast.info(API_MESSAGES.INFO.LOGOUT);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || API_MESSAGES.ERROR.LOGIN_FAILED;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;

