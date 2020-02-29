export const state = () => ({
  id: null,
  role: null,
  name: null,
  error: false
})

export const actions = {
  async auth({ commit }, payload) {
    await this.$axios
      .post('/auth', Object.assign(payload, { type: 'login' }))
      .then(response => {
        commit('SET_ERROR', false)
        this.$cookies.set('access_token', response.data.access_token, {
          path: '/',
          maxAge: 60 * 60 * 2
        })
        $nuxt.$router.push('/profiles')
      })
      .catch(e => {
        console.log(e)
        commit('SET_ERROR', true)
      })
  },
  logout({ commit }) {
    this.$cookies.removeAll()
    commit('LOG_OUT')
  },

  async getUserParams({ dispatch, commit }, payload) {
    await this.$axios
      .post('/user-params', {
        params: payload
      })
      .then(response => {
        commit('SET_USER_PARAMS', response.data)
      })
      .catch(e => {})
  }
}

export const mutations = {
  SET_USER_PARAMS(state, payload) {
    state.id = payload.id
    state.name = payload.user_details ? payload.user_details.name : null
    state.role = payload.roles[0].name
  },
  LOG_OUT(state) {
    ;(state.id = null), (state.name = null), (state.role = null)
  },
  SET_ERROR(state, payload) {
    state.error = payload
  }
}
