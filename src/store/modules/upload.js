export default {
  namespaced: true,
  state: {
    status: false,
    name: ''
  },
  mutations: {
    updateStatus (state, status) {
      state.status = status
    },
    updateName (state, name) {
      state.name = name
    }
  }
}
