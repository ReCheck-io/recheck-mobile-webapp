<template>
<div>
  <v-footer
    dark
    fixed
  >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-actions dark class="justify-center">
             <div>
        Copyright &copy;<span v-if="new Date().getFullYear() > 2016"> {{new Date().getFullYear()}}</span>, ReCheck B.V. All rights reserved.
      </div>
      </v-card-actions>
    </v-card>
  </v-footer>
</div>
</template>

<script>
export default {
  data: () => ({
    icons: ['fab fa-facebook', 'fab fa-twitter', 'fab fa-google-plus', 'fab fa-linkedin', 'fab fa-instagram']
  })
}
</script>

<style scoped>
</style>
