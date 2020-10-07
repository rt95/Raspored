<template>
  <header>
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top"
      style="background-color: #191919;"
    >
      <div class="container">
        <a
          class="navbar-brand"
          href="/naslovnica"
        >
          <img
            src="../assets/img/vublogo.svg"
            alt="logo"
            class="img-fluid"
          >
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse"
          id="navbarResponsive"
        >
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/naslovnica"
              >Naslovnica</router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/raspored"
              >Raspored</router-link>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                @click="logout"
              >Log out</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig.js')
export default {
  name: 'vubHeader',
  methods: {
    logout () {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch('clearData')
          this.$router.push('/login')
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-brand {
  padding: 30px;
}

.navbar-brand img {
  position: absolute;
  margin-top: -20px;
  height: 40px;
}

.nav-item {
  margin: auto;
}

nav li:hover,
nav li.router-link-active,
nav li.router-link-exact-active {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #ff2a2a;
}

/* MEDIA */
/* ultrawide */

@media (min-width: 2300px) {
  .container {
    max-width: 90%;
    font-size: 2.5vh;
  }
  nav {
    height: 10vh;
  }
  .nav-item {
    padding: 10px;
  }
  .navbar-brand img {
    position: absolute;
    margin-top: -2.5vh;
    height: 5vh;
  }
}
</style>
