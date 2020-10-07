<template>
  <div id="login">
    <transition name="fade">
      <div class="loading"><i class="material-icons">
          info
        </i>
        <p>Performing request...</p>
      </div>
    </transition>
    <!-- login form -->
    <div :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
      <form
        v-if="showLoginForm"
        @submit.prevent
      >
        <h1>Welcome Back</h1>
        <div class="form">
          <input
            v-model.trim="loginForm.email"
            type="text"
            placeholder="Enter your email"
            id="email1"
          >
          <br>
          <input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="Enter your password"
            id="password1"
          >
          <br>
          <button
            @click="login"
            class="button"
          >Log In</button>
          <br>
          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
            <br>
            <a @click="toggleForm">Create an Account</a>
          </div>
        </div>
      </form>
      <!-- sign up form -->
      <form
        v-if="!showLoginForm && !showForgotPassword"
        @submit.prevent
      >
        <h1>Get Started</h1>

        <input
          v-model.trim="signupForm.name"
          type="text"
          placeholder="Username"
          id="name"
        >
        <br>

        <input
          v-model.trim="signupForm.title"
          type="text"
          placeholder="Company name"
          id="title"
        >
        <br>

        <input
          v-model.trim="signupForm.email"
          type="text"
          placeholder="Email"
          id="email2"
        >
        <br>
        <input
          v-model.trim="signupForm.password"
          type="password"
          placeholder="Password"
          id="password2"
        >
        <br>
        <button
          @click="signup"
          class="button"
        >Sign Up</button>

        <div class="extras">
          <a @click="toggleForm">Back to Log In</a>
        </div>
      </form>
      <!-- forgot password form -->
      <form
        v-if="showForgotPassword"
        @submit.prevent
        class="password-reset"
      >
        <div v-if="!passwordResetSuccess">
          <h1>Reset Password</h1>
          <p>We will send you an email to reset your password</p>

          <label
            for="email3"
            style="margin:10px"
          >Email:</label>
          <input
            v-model.trim="passwordForm.email"
            type="text"
            placeholder="you@email.com"
            id="email3"
          >

          <button
            @click="resetPassword"
            class="button"
          >Submit</button>

          <div class="extras">
            <a @click="togglePasswordReset">Back to Log In</a>
          </div>
        </div>
        <div v-else>
          <h1>Email Sent</h1>
          <p>check your email for a link to reset your password</p>
          <button
            @click="togglePasswordReset"
            class="button"
          >Back to login</button>
        </div>
      </form>
      <transition name="fade">
        <div
          v-if="errorMsg !== ''"
          class="error-msg"
        >
          <p>{{ errorMsg }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
const fb = require('../firebaseConfig.js')
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: ''
      },
      passwordForm: {
        email: ''
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ''
    }
  },
  methods: {
    toggleForm () {
      this.errorMsg = ''
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset () {
      if (this.showForgotPassword) {
        this.showLoginForm = true
        this.showForgotPassword = false
        this.passwordResetSuccess = false
      } else {
        this.showLoginForm = false
        this.showForgotPassword = true
      }
    },
    login () {
      this.performingRequest = true
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user)
          this.$store.dispatch('fetchUserProfile')
          this.performingRequest = false
          this.$router.push('/naslovnica')
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    signup () {
      this.performingRequest = true
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit('setCurrentUser', user.user)

          // create user obj
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              title: this.signupForm.title
            })
            .then(() => {
              this.$store.dispatch('fetchUserProfile')
              this.performingRequest = false
              this.$router.push('/naslovnica')
            })
            .catch(err => {
              console.log(err)
              this.performingRequest = false
              this.errorMsg = err.message
            })
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    },
    resetPassword () {
      this.performingRequest = true
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false
          this.passwordResetSuccess = true
          this.passwordForm.email = ''
        })
        .catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  margin: 10px 0;
  width: 250px;
  padding: 15px;
}
button {
  margin: 20px;
  width: 250px;
  cursor: pointer;
}
.extras a {
  cursor: pointer;
}
.loading {
  position: fixed;
  top: 2.5vh;
  left: 0;
  right: 0;
}
.loading p {
  position: fixed;
  margin-top: 1px;
  margin-left: 3px;
  left: 0;
  right: 0;
}

/* MEDIA */

@media (max-width: 1000px) {
  form {
    margin-top: -85px;
  }
  form h1 {
    margin-bottom: -10px;
  }
  .loading {
    position: fixed;
    top: 2.5vh;
    left: 0;
    right: 0;
    margin-top: 10px;
    margin-right: 155px;
  }
  .loading p {
    position: fixed;
    margin-top: 1px;
    margin-left: 3px;
    left: 0;
    right: 0;
  }
}
</style>
