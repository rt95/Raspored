import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')
Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data())
    })

    // realtime updates from cellDataCollection
    fb.cellDataCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      let dataArray = []
      querySnapshot.forEach(doc => {
        let data = doc.data()
        data.id = doc.id
        dataArray.push(data)
      })
      store.commit('setData', dataArray)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    // Modal
    active: false,
    target: null,
    rowIndex: null,
    elementIndex: null,
    dayOfElement: null,
    monthOfElement: null,
    // login
    currentUser: null,
    userProfile: {},
    // cell data
    data: [],
    content: {
      time: null,
      title: null,
      status: null,
      room: null,
      location: null
    }
  },
  getters: {
    // get status of active -> modal.vue
    getModalState: state => {
      return state.active
    }
  },
  mutations: {
    setStateData (state, data) {
      state.content.time = data.time
      state.content.title = data.title
      state.content.status = data.status
      state.content.room = data.room
      state.content.location = data.location
    },
    setData (state, val) {
      if (val) {
        state.data = val
      } else {
        state.data = []
      }
    },
    // toggleModal global
    toggleModal (state, elementData) {
      if (elementData) {
        state.target = elementData.target
        state.elementIndex = elementData.elementIndex
        state.rowIndex = elementData.rowIndex
        state.monthOfElement = elementData.monthOfElement
        state.dayOfElement = elementData.dayOfElement
      }
      state.active = !state.active
    },

    // login
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setUserProfile (state, val) {
      state.userProfile = val
    }
  },
  actions: {
    createNewRecord ({ state, commit }, data) {
      commit('setStateData', data)

      let time = state.content.time
      let title = state.content.title
      let status = state.content.status
      let room = state.content.room
      let location = state.content.location
      fb.cellDataCollection.where('rowIndex', '==', state.rowIndex).where('elementIndex', '==', state.elementIndex).where('monthOfElement', '==', state.monthOfElement).where('dayOfElement', '==', state.dayOfElement).get().then(snapshot => {
        if (snapshot.empty) {
          fb.cellDataCollection.add({
            createdOn: new Date(),
            userId: state.currentUser.uid,
            userName: state.userProfile.name,
            content: state.content,
            rowIndex: state.rowIndex,
            elementIndex: state.elementIndex,
            monthOfElement: state.monthOfElement,
            dayOfElement: state.dayOfElement
          }).then(ref => {
            state.content.time = ''
            state.content.title = ''
            state.content.status = ''
            state.content.room = ''
            state.content.location = ''
            state.rowIndex = ''
            state.elementIndex = ''
            state.monthOfElement = ''
            state.dayOfElement = ''
          }).catch(err => {
            console.log(err)
          })
        } else {
          snapshot.forEach(doc => {
            fb.cellDataCollection.doc(doc.id).update({
              content: {
                time: time,
                title: title,
                status: status,
                room: room,
                location: location
              }
            })
          })
        }
      })
        .catch(err => {
          console.log('Error getting documents', err)
        })

      state.active = !state.active
    },

    // login/logout
    clearData ({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
    },

    fetchUserProfile ({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit('setUserProfile', res.data())
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
