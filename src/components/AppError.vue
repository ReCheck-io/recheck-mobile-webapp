<template>
  <v-snackbar
    dark
    v-model="snackbar"
    :color="color"
    :timeout="timeout"
  >
    {{ text }}
    <v-btn
      dark
      flat
      @click="snackbar = false"
    >
      OK
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  mounted () {
    this.$root.$on('error_on', (text, color) => {
      this.snackbar = true
      this.text = text
      this.color = color
    })
    this.$root.$on('error_off', () => {
      this.snackbar = false
    })
  },
  data () {
    return {
      snackbar: false,
      color: '',
      timeout: 3000,
      text: ''
    }
  }
}
</script>

<style scoped>
.title {
    text-align: center;
}
</style>
