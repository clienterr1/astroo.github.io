export default {
    namespaced: true,
    state: {
        ws: undefined,
        achievements: [],
        isGamificationLoaded: false,
        lastCompletedAchievement: {},
        createdAt: null,
    },
    getters: {
        completedAchievementsCount: (state) => state.achievements.filter(({
            isCompleted
        }) => isCompleted).length,
    },
    mutations: {
        setWebsocketObject(state, ws) {
            state.ws = ws;
        },
        setAchievements(state, achievements) {
            state.achievements = achievements;
        },
        setIsGamificationLoaded(state, value) {
            state.isGamificationLoaded = value;
        },
        setLastCompletedAchievement(state, value) {
            state.lastCompletedAchievement = value;
        },
        setCreatedAt(state, value) {
            state.createdAt = value;
        },
    },
    actions: {
        setWebsocketObject({
            commit
        }, value) {
            commit('setWebsocketObject', value);
        },
        setAchievements({
            commit
        }, value) {
            commit('setAchievements', value);
        },
        setIsGamificationLoaded({
            commit
        }, value) {
            commit('setIsGamificationLoaded', value);
        },
        setLastCompletedAchievement({
            commit
        }, value) {
            commit('setLastCompletedAchievement', value);
        },
        setCreatedAt({
            commit
        }, value) {
            commit('setCreatedAt', value);
        },
    },
};