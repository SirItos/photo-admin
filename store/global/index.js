export const state = () => ({
  header: null
})

export const actions = {
  changeHeader({ commit }, payload) {
    commit('CHANGE_HEADER', payload)
  }
}

export const mutations = {
  CHANGE_HEADER(state, payload) {
    if (!payload) return
    state.header = payload
  }
}
