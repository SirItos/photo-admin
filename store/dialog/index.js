export const state = () => ({
  visibility: false,
  title: null,
  text: null,
  okLabel: null,
  cancelLabel: null,
  okAction: null,
  cancelAction: null,
  confirm: false,
  form: false,
  reason: null
})

export const actions = {
  setDialogParams({ commit }, payload) {
    commit('SET_DIALOG_PARAMS', payload)
  },
  setReason({ commit }, { reason }) {
    commit('SET_REASON', reason)
  }
}

export const mutations = {
  SET_DIALOG_PARAMS(state, payload) {
    state.visibility = payload.visibility || false
    state.title = payload.title || null
    state.text = payload.text || null
    state.okLabel = payload.okLabel || null
    state.cancelLabel = payload.cancelLabel || null
    state.cancelAction = payload.cancelAction || null
    state.confirm = payload.confirm || false
    state.okAction = payload.okAction || null
    state.form = payload.form || false
  },
  SET_REASON(state, payload) {
    state.reason = payload || null
  }
}
