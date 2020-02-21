export const state = () => ({
  id: null,
  role: null,
  name: null
})

export const actions = {
  async auth({ commit }, payload) {
    await this.$axios
      .post('/auth', Object.assign(payload, { type: 'login' }))
      .then(response => {
        this.$cookies.set('access_token', response.data.access_token, {
          path: '/',
          maxAge: 60 * 60 * 2
        })
        console.log('auth done')
        $nuxt.$router.push('/')
      })
      .catch(e => {
        console.log(e)
      })
  },
  logout({ commit, dispatch }) {},

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
  }
}
