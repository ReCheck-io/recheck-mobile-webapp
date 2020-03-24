<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
      data-app="true"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please wait ...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$root.$on('progress_on', () => {
      this.dialog = true
    })
    this.$root.$on('progress_off', () => {
      this.dialog = false
    })
  },
  data () {
    return {
      dialog: false
    }
  }
}
</script>
