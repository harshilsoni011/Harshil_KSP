import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { kspAPI } from "../utils/api";

export const fetchSidebarData = createAsyncThunk(
    "common/fetchSidebarData",
    async (_, { rejectWithValue }) => {
        try {
            const [tagsRes, usersRes] = await Promise.all([
                kspAPI.getTrendingTags().catch(() => ({ data: { tags: [] } })),
                kspAPI.getTopUsers().catch(() => ({ data: { users: [] } })),
            ]);
            return {
                trendingTags: tagsRes.data?.tags || [],
                topUsers: usersRes.data?.users || [],
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    trendingTags: [],
    topUsers: [],
    loading: false,
    error: null,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSidebarData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSidebarData.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingTags = action.payload.trendingTags;
                state.topUsers = action.payload.topUsers;
            })
            .addCase(fetchSidebarData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default commonSlice.reducer;
