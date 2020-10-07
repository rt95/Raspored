<template>
  <div
    class="_modal"
    :class="{'modal-hidden': !active, 'modal-visible': active}"
    :aria-hidden="!active"
    tabindex="-1"
    role="dialog"
  >
    <transition name="modal">
      <div
        class="modal-mask"
        v-if="active"
      >
        <div class="modal-wrapper">
          <div class="modal-container">
            <slot name="header">
              <i
                class="modal-close material-icons"
                @click="closeModal"
                arial-label="close"
              >close</i>
            </slot>
            <form
              method="post"
              @submit="checkForErrorsOnSubmit"
            >
              <div class="modal-body">
                <slot name="body">
                  <label>Vrijeme:</label>
                  <input
                    type="time"
                    v-model="data.time"
                    required
                  >
                  <br>
                  <label>Naziv Predmeta:</label>
                  <select
                    v-model="data.title"
                    required
                  >
                    <option>Baze Podataka</option>
                    <option>Objektno orijentirano programiranje</option>
                    <option>Web programiranje 1</option>
                    <option>Web programiranje 2</option>
                  </select>
                  <br>
                  <label>Vrsta:</label>
                  <select
                    v-model="data.status"
                    required
                  >
                    <option>Predavanje</option>
                    <option>Vjezbe</option>
                    <option>Laboratorijske vjezbe</option>
                  </select>
                  <br>
                  <label>Dvorana:</label>
                  <input
                    v-model="data.room"
                    name="firstname"
                    type="number"
                    required
                  >
                  <br>
                  <label>Lokacija:</label>
                  <select
                    v-model="data.location"
                    required
                  >
                    <option>A.B Šimića</option>
                    <option>ona druga</option>
                  </select>
                  <br>
                  <button
                    class="modal-default-button btn btn-outline-secondary"
                    type="submit"
                    value="Submit"
                  >Spremi Promjenu</button>
                </slot>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'modal',
  data () {
    return {
      active: false,
      data: {
        time: null,
        title: null,
        status: null,
        room: null,
        location: null
      }
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('toggleModal')
      this.active = false
    },
    // check for errors and send data to store.js
    checkForErrorsOnSubmit: function (e) {
      e.preventDefault()
      var errors = false

      if ((this.time || this.title || this.status || this.room || this.location) === null) {
        this.errors = true
      }

      // if no errors continue
      if (!errors) {
        this.$store.dispatch('createNewRecord', this.data)
      }
    }
  },
  computed: {
    showModal () {
      if (this.$store.getters.getModalState) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    showModal: {
      handler: function (val) {
        this.active = val
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-body input,
select,
label {
  width: 150px;
  margin: 2px;

  -webkit-box-sizing: border-box; /* For legacy WebKit based browsers */
  -moz-box-sizing: border-box; /* For legacy (Firefox <29) Gecko based browsers */
  box-sizing: border-box;
}
.modal-close {
  margin-left: 95%;

  cursor: pointer;
}

.modal-default-button {
  margin: auto;
}

.btn {
  margin: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* MEDIA */

@media (max-width: 1000px) {
  .modal-container {
    width: 80%;
  }
  .modal-container .btn {
    margin-top: 35px;
  }
}
</style>
