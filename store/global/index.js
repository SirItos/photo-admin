export const state = () => ({
  header: null,
  overlay: false,
  breadcrumbs: []
})

export const actions = {
  changeHeader({ commit }, payload) {
    commit('CHANGE_HEADER', payload)
  },
  setOverlay({ commit }, payload) {
    commit('SET_OVERLAY', payload)
  },
  setBreadctumbs({ commit }, payload) {
    commit('SET_BREADCRUMBS', payload)
  }
}

export const mutations = {
  CHANGE_HEADER(state, payload) {
    if (!payload) return
    state.header = payload
  },
  SET_OVERLAY(state, payload) {
    state.overlay = payload
  },
  SET_BREADCRUMBS(state, payload) {
    state.breadcrumbs = payload || []
  }
}
