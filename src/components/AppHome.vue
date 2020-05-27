<template>
  <v-container scrollable>
    <v-layout scrollable>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!pinned">
          <v-img class="white--text" height="100px" src="img/banners/recheck-welcome.jpg">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-content-start align-end fill-height flexbox>
                  <h2>Sensitive Data Protection and Exchange</h2>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div>Thank you for using ReCheck Mobile. Register and create your own digital identity.</div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/identity">
              <v-btn dark color="green">Register</v-btn>
            </router-link>
            <v-spacer />
          </v-card-actions>
        </v-card>
         <v-card v-if="pinned">
          <v-img class="white--text" height="100px" src="img/banners/recheck-welcome.jpg">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-content-start align-end fill-height flexbox>
                  <h2>Sensitive Data Protection and Exchange</h2>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div>Thank you for using ReCheck Mobile. You can now login and sign documents by just scanning QR codes.</div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/scan">
              <v-btn dark color="green">SCAN</v-btn>
            </router-link>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card v-if="pinned" style="margin-top:1rem">
          <v-img class="white--text" height="100px" src="img/banners/recheck-data.jpg">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-content-start align-end fill-height flexbox>
                  <h2>Your data is finally YOURS!</h2>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div>ReCheck servers don't store user credentials. Your identity is entirely owned and controlled by you. Please check your identity details and make sure you back it up.</div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/identity">
              <v-btn dark color="green">IDENTITY</v-btn>
            </router-link>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import chain from "../chain";

export default {
  mounted() {
    this.pinned = chain.pinned();
  },
  data() {
    return {
      pinned: false
    };
  }
};
</script>

<style scoped>
.spaced {
  margin-top: 10rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
a {
  text-decoration: none;
}
</style>
