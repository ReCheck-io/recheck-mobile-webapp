<template>
  <div class="componentTitle">
    <div style="margin:5rem;" />
    <v-card dark class="rounded-card">
      <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">Manage your PIN</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        In this section you can either
        <strong>change</strong> your PIN.
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="changePIN" large dark color="green">Change</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
 
  <div style="margin:1rem;" />
      <v-card dark class="rounded-card">
         <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">Time for PIN automation</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        Or set for
        <strong>how much minutes</strong> do you wish your PIN to be remembered
        for. Right now it is set at
        <br /><br />
        <h3>{{this.$store.state.timeToRemember/60000}} minutes.</h3>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on" style="align:center">Time to remember</v-btn>
          </template>
          <ul
            style="background-color:white; list-style-type:none; text-align:left"
            v-for="(item, index) in dropdown_time"
            :key="index"
            @click="timeToRemember(item.text)"
          >
            <li>{{item.text}} minutes</li>
          </ul>
        </v-menu>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <div style="margin:1rem;" />

    <v-layout row justify-center>
      <v-dialog v-model="this.showPinDialog" @keydown.esc="cancel" persistent max-width="600px">
        <v-card>
          <v-toolbar color="#16415c" dark dense flat>
            <v-toolbar-title class="white--text">PIN</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-card-text v-show="!!pinMessage">
                    <strong>{{ pinMessage }}</strong>
                  </v-card-text>
                  <v-text-field
                    type="password"
                    v-model="pin"
                    label="PIN"
                    hint="Please enter PIN."
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" dark @click="cancelPin">Cancel</v-btn>
            <v-btn color="green" dark @click="confirmPin">Confirm</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import chain from "../chain";

// const Console = require("../logger");

export default {
  data: () => ({
    dropdown_time: [{ text: "5" }, { text: "10" }, { text: "15" }],
    pinDialog: 0,
    pin: "",
    pin1: "",
    pin2: "",
    pinMessage: "Enter your PIN",
    showPinDialog: false,
    PINchange: false,
    pinned: false
  }),
  methods: {
    changePIN() {
      if (!this.$store.state.automatedPIN) {
        this.pin = "";
        this.pinMessage = "Enter your old PIN";
        this.PINchange = true;
        this.pinDialog = 3;
        this.showPinDialog = true;
      } else {
        this.$root.$emit(
          "error_on",
          "You cannot change your PIN, while in PINless mode",
          "red"
        );
      }
    },
    confirmPin() {
      if (this.pinDialog === 3) {
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.pinMessage = "Please repeat your new PIN";
          this.pin1 = this.pin;
          this.pin = "";
          this.pinDialog = 5;
          this.showPinDialog = true;
        }
      }
      // Changing the PIN
      else if (this.pinDialog === 5) {
        this.PINchange = false;
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.pin2 = this.pin;
          this.showPinDialog = false;
          this.$root.$emit("progress_on");
          if (chain.resetPIN(this.pin1, this.pin2)) {
            this.pinned = chain.pinned();
            this.$root.$emit("walletEvent");
            this.$root.$emit("progress_off");
            this.$root.$emit("error_on", "PIN changed successfully!", "green");
          } else {
            this.$root.$emit("progress_off");
            this.$root.$emit("error_on", "Old PIN mismatch", "red");
          }
        }
      }
    },
    cancelPin() {
      this.pin1 = "";
      this.pin2 = "";
      this.pin = "";
      this.showPinDialog = false;
      this.pinDialog = 0;
    },
    timeToRemember(time) {
      time = time * 60000;
      this.$store.commit("rememberTime", time);
    }
  },
  computed: {
    returnPINState() {
      return this.$store.getters.returnPINState;
    },
    returnRememberedPIN() {
      return this.$store.getters.returnSavedPIN;
    },
    returnTime() {
      return this.text;
    }
  }
};
</script>

<style>
.componentTitle {
  margin-top: 8rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
