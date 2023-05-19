export default {
    namespaced: true,
    getters: {
        // enable only layout (disable grid) for specific templates
        isLayoutOnly: (state, getters, rootState, rootGetters) => rootGetters.siteMeta.isLayout,
    },
};