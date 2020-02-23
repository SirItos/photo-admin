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
    state.header = payload
  }
}
