<template>
  <div class="componentTitle">
    <div style="margin:5rem;" />

    <v-card v-if="!this.pinned" dark class="rounded-card">
      <v-toolbar color="red" fflat>
        <v-toolbar-title class="white--text">Identity Required</v-toolbar-title>
      </v-toolbar>
      <v-card-text>You have to create an identity first in order to use our service.</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="goToIdentity" dark color="blue">Identity Settings</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

    <v-card v-if="this.pinned" dark class="rounded-card">
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
    <v-card v-if="this.pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">Time for PIN automation</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        Or set for
        <strong>how much minutes</strong> do you wish your PIN to be remembered
        for. Right now it is set at
        <br />
        <br />
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

    <v-card v-if="this.pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">Reset identity</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <strong>
          Reset Identity will remove your current identity. If you have not saved the phrase for your current identity
          it will be lost FOREVER.
        </strong>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="newIdentity" large dark color="red">Reset Identity</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

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

    <v-layout row justify-center>
      <v-dialog
        v-model="this.showChangeIdentityDialog"
        @keydown.esc="cancel"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-toolbar color="#16415c" dark dense flat>
            <v-toolbar-title class="white--text">Changing Identity</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-card-text v-show="!!pinMessage">
                    <strong>{{ pinMessage }}</strong>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" dark @click="cancelPin">Cancel</v-btn>
            <v-btn color="red" dark @click="confirmNewIdentity">Confirm</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import chain from "../chain";
import router from "../router";

// const Console = require("../logger");

export default {
  mounted() {
    this.pinned = chain.pinned();
  },
  data: () => ({
    dropdown_time: [{ text: "5" }, { text: "10" }, { text: "15" }],
    pinDialog: 0,
    pin: "",
    pinOld: "",
    pinNew: "",
    pinNewPINConfirm: "",
    pinMessage: "Enter your PIN",
    showPinDialog: false,
    showChangeIdentityDialog: false,
    PINchange: false,
    pinned: false
  }),
  methods: {
    goToIdentity() {
      router.push("/identity");
    },
    newIdentity() {
      this.pinMessage = "Are you really sure you want to reset your Identity";
      this.pinDialog = 10;
      this.$root.$emit("progress_on");
      setTimeout(() => {
        this.showChangeIdentityDialog = true;
        this.$root.$emit("progress_off");
      }, 3000);
    },

    confirmNewIdentity() {
      if (this.pinDialog === 10) {
        this.pinMessage =
          "Are you really sure you want to reset your identity ? You will lose the current one forever!";
        this.pinDialog = 11;
        this.showChangeIdentityDialog = true;
      } else if (this.pinDialog === 11) {
        localStorage.clear();
        router.push("/identity");
      }
    },

    changePIN() {
        this.pin = "";
        this.pinMessage = "Enter your old PIN";
        this.PINchange = true;
        this.pinDialog = 3;
        this.showPinDialog = true;    
    },

    confirmPin() {
      if (this.pinDialog === 3) {
        if (chain.checkPassword(this.pin)) {
          if (this.pin.length < 4) {
            this.$root.$emit(
              "error_on",
              "PIN must be at least 4 characters long!",
              "red"
            );
          } else {
            this.pinMessage = "Enter your new PIN";
            this.pinOld = this.pin;
            this.pin = "";
            this.pinDialog = 4;
            this.showPinDialog = true;
          }
        } else {
          this.$root.$emit(
            "error_on",
            "Current PIN you want to change is incorrect",
            "red"
          );
        }
      } else if (this.pinDialog === 4) {
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.pinMessage = "Please repeat your new PIN";
          this.pinNew = this.pin;
          if (this.pinOld === this.pinNew) {
            this.showPinDialog = false;
            this.$root.$emit(
              "error_on",
              "The new PIN cannot be the same as the old one!",
              "red"
            );
          } else {
            this.pin = "";
            this.pinDialog = 5;
            this.showPinDialog = true;
          }
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
          this.pinNewPINConfirm = this.pin;
          this.showPinDialog = false;
          if (this.pinNew === this.pinNewPINConfirm) {
            this.$root.$emit("progress_on");
            if (chain.resetPIN(this.pinOld, this.pinNewPINConfirm)) {
              this.pinned = chain.pinned();
              if (this.$store.state.automatedPIN) {
                this.pinAutomation(this.pinNew)
              }
              this.$root.$emit("walletEvent");
              this.$root.$emit("progress_off");
              this.$root.$emit(
                "error_on",
                "PIN changed successfully!",
                "green"
              );
            } else {
              this.$root.$emit("progress_off");
              this.$root.$emit("error_on", "Old PIN mismatch", "red");
            }
          } else {
            this.pinDialog = 5;
            this.pinMessage =
              "The confirmation of the new PIN was incorrect! Please input the correct one.";
            this.pin = "";
            this.showPinDialog = true;
            this.$root.$emit("progress_off");
            this.$root.$emit(
              "error_on",
              "New PIN confirmation mismatch",
              "red"
            );
          }
        }
      }
    },
    cancelPin() {
      this.pinOld = "";
      this.pinNew = "";
      this.pinNewPINConfirm = "";
      this.pin = "";
      this.showPinDialog = false;
      this.pinDialog = 0;
      this.showChangeIdentityDialog = false;
    },
    timeToRemember(time) {
      time = time * 60000;
      this.$store.commit("rememberTime", time);
    },
    async pinAutomation(PIN) {
          this.showPinDialog = false;
          await this.rememberPIN(PIN);
          this.$root.$emit("error_on", "PIN remembered successfully!", "green");  
    },
    async rememberPIN(userPIN) {
      this.$store.dispatch("startTiming", userPIN);
      await this.$store.dispatch("deadline");
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
