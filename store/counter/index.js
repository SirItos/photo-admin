export const state = () => ({
  resources: null,
  feedback: null
})

export const actions = {
  async loadCounter({ commit }) {
    await this.$axios
      .get('/get-counter')
      .then(response => {
        commit('SET_COUNTER', response.data)
      })
      .catch(e => {
        console.log(e)
      })
  },
  subCounter({ commit }, payload) {
    commit('SUB_COUNTER', payload)
  }
}

export const mutations = {
  SET_COUNTER(state, payload) {
    Object.keys(payload).forEach(key => {
      state[key] = payload[key]
    })
  },
  SUB_COUNTER(state, payload) {
    state[payload.key] = payload.value
  }
}
