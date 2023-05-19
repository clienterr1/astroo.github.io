const MAX_RECENT_COLORS = 4;

const SET_RECENT_COLOR = 'SET_RECENT_COLOR';

export default {
    namespaced: true,
    state: {
        recentColors: [],
    },
    mutations: {
        [SET_RECENT_COLOR]: (state, {
            color
        }) => {
            if (state.recentColors.length >= MAX_RECENT_COLORS) {
                state.recentColors.pop();
            }

            state.recentColors.unshift(color);
        },
    },
    actions: {
        addRecentColor: ({
            state,
            commit,
        }, color) => {
            if (state.recentColors.includes(color) || !color) {
                return;
            }

            commit(SET_RECENT_COLOR, {
                color,
            });
        },
    },
};