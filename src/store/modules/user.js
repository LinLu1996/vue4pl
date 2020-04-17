export default {
  namespaced: true,
  state: {
    id: 0,
    type: 0,
    name: '',
    token: '',
    realName: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    getToken (state, token) {
      state.token = token
    },
    updateType (state, type) {
      state.type = type
    },
    updateName (state, name) {
      state.name = name
    },
    updateRealName (state, realName) {
      state.realName = realName
    }
  }
}
