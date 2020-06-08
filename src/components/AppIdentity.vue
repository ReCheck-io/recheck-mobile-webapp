<template>
  <div class="componentTitle">
    <div v-if="this.pinned" style="margin:5rem;" />
    <v-card v-if="pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">Blockchain User Identity</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="breakchars">
          <h4
            color="gray"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            :class="{ active: hover }"
            @click="copyStringToClipboard(returnReturnIdentity)"
          >{{returnReturnIdentity}}</h4>
        </div>
      </v-card-text>
    </v-card>
    <div v-if="this.pinned" style="margin:1rem;" />
    <v-card v-if="pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" flat>
        <v-toolbar-title class="white--text">Backup</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        It is
        <strong>STRONGLY</strong> advised that you make a backup copy of your private key!
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="backupIdentity" large dark color="green">Backup</v-btn>
        <!-- <v-btn large dark color="black" @click="restoreIdentity">Restore</v-btn> -->
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <div v-if="!this.pinned" style="margin:5rem;" />
    <v-card v-if="!pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" flat>
        <v-toolbar-title class="white--text">New Identity</v-toolbar-title>
      </v-toolbar>
      <v-card-text>To start using the app, please create your new digital identity. You will be asked to create and remember your personal security PIN.</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="createIdentity" large dark color="green">Create Identity</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <div v-if="!this.pinned" style="margin:1rem;" />
    <v-card v-if="!pinned" dark class="rounded-card">
      <v-toolbar color="#16415c" flat>
        <v-toolbar-title class="white--text">Restore Identity</v-toolbar-title>
      </v-toolbar>
      <v-card-text>If you already have an identity and keep your secret phrase, you can restore it. You will be asked to create and remember your personal security PIN.</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click="restoreIdentityAtStart" large dark color="green">Restore Identity</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-dialog data-app="true" v-model="privateKeyDialog">
      <v-card>
        <v-toolbar color="#16415c" dark dense flat>
          <v-toolbar-title class="white--text">Your Key Mnemonic</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!privateKey">
          <div class="breakchars">{{ privateKey }}</div>
        </v-card-text>
        <input id="clipboardInput" name="clipboardInput" type="hidden" :value="privateKey" />
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="blue" dark @click="privateKeyDialog = false">OK</v-btn>
          <v-btn color="green" dark @click="copyToClipboard">Copy to clipboard</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row justify-center>
      <v-dialog v-model="importDialog" persistent max-width="600px">
        <v-card>
          <v-toolbar color="#16415c" dark dense flat>
            <v-toolbar-title class="white--text">Restore Identity</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-card-text class="phrase">
                    <strong>Plase enter your 12 word secret phrase</strong>
                  </v-card-text>
                  <v-text-field
                    ref="mnemonics"
                    v-model="privateKey"
                    hint="Please enter your secret phrase."
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" dark @click="importDialog = false">Cancel</v-btn>
            <v-btn color="green" dark @click="doRestoreIdentity">Restore</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
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
          <v-card-actions v-if="!this.$store.state.automatedPIN && check">
            <v-spacer></v-spacer>
            <input type="checkbox" id="checkbox" @click="hint = !hint" v-model="automation" />
            &nbsp;&nbsp;
            <label for="checkbox">Remember your PIN</label>

            <v-spacer></v-spacer>
          </v-card-actions>
          <v-card-actions v-if="!this.$store.state.automatedPIN">
            <v-spacer></v-spacer>
            <span v-if="hint">
              You can specify the time in
              <strong>Security Settings section.</strong>
            </span>
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
const Console = require("../logger");

export default {
  mounted() {
    this.pinned = chain.pinned();
    this.$root.$on("walletEvent", () => {
      this.publicAddress = localStorage.publicAddress;
    });
    if (this.pinned) {
      this.publicAddress = localStorage.publicAddress;
    }
  },
  data() {
    return {
      urlChallenge: this.$route.params.challenge
        ? this.$route.params.challenge
        : "",
      pinned: false,
      publicAddress: "",
      privateKey: "",
      privateKeyDialog: false,
      importDialog: false,
      hover: false,
      pin: "",
      pin1: "",
      pin2: "",
      pinDiaog: 0,
      showPinDialog: false,
      pinMessage: "Enter your PIN",
      automation: false,
      hint: false,
      check: true,
      environment: process.env.NODE_ENV.split(","),
      restore: false,
      hasIdentity: false
    };
  },
  methods: {
    seedCheck(seedPhrase) {
      seedPhrase = seedPhrase.trim();
      if (seedPhrase.split(" ").length == 12) {
        return true;
      } else {
        return false;
      }
    },

    createIdentity() {
      this.check = false;
      this.pin = "";
      this.pinMessage = "Please choose a new PIN";
      this.pinDialog = 3;
      this.showPinDialog = true;
    },

    isUserExisting(pubKey) {
      chain.checkUser(this.environment[0], pubKey, res => {
        if (res.data.userId) {
          this.hasIdentity = true;
        }
      });
    },

    copyToClipboard() {
      let valueToCopy = document.querySelector("#clipboardInput");
      valueToCopy.setAttribute("type", "text");
      valueToCopy.select();
      try {
        var successful = document.execCommand("copy");
        if (successful) {
          this.$root.$emit(
            "error_on",
            "Mnemonic copied to clipboard.",
            "green"
          );
        } else {
          this.$root.$emit("error_on", "Could not copy to clipboard!", "red");
        }
      } catch (err) {
        this.$root.$emit("error_on", "Could not copy to clipboard!", "red");
      }

      valueToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },

    backupIdentity() {
      if (chain.pinned()) {
        this.pin = "";
        this.pinDialog = 1;
        this.showPinDialog = true;
        this.pinMessage = "Please enter your PIN";
      }
    },

    restoreIdentityAtStart() {
      this.restore = true;
      this.check = false;
      this.pin = "";
      this.pinMessage = "Please choose a new PIN";
      this.pinDialog = 10;
      this.showPinDialog = true;
    },

    async doRestoreIdentity() {
      this.privateKey = this.privateKey.trim();
      if (this.seedCheck(this.privateKey)) {
        if (!chain.pinned()) {
          Console.log("new privateKey", this.privateKey);
          this.$root.$emit("progress_on");
          await chain.restoreIdentityAtStart(this.pin, this.privateKey);
          this.privateKey = "";
          if (this.restore) {
            chain.loadWallet(this.pin);
            this.isUserExisting(localStorage.publicAddress);
            setTimeout(() => {
              if (!this.hasIdentity) {
                this.$root.$emit("progress_off");
                this.$root.$emit(
                  "error_on",
                  "This identity has never been used! Check again!",
                  "red"
                );
                chain.resetWallet();
                localStorage.clear();
                this.restore = false;
                this.$router.go(0);
              } else {
                this.$root.$emit("progress_off");
                this.$root.$emit("walletEvent");
                this.$root.$emit(
                  "error_on",
                  "Identity restored successfully!",
                  "green"
                );
                this.$router.go(0);
              }
            }, 1000);
          } else {
            setTimeout(() => {
              this.$root.$emit("progress_off");
              this.$root.$emit("walletEvent");
              this.$root.$emit(
                "error_on",
                "Identity imported successfully!",
                "green"
              );
              this.$router.go(0);
            }, 1000);
          }
          this.importDialog = false;
        }
      } else {
        this.$root.$emit(
          "error_on",
          "The secret phrase have to be 12 words.",
          "red"
        );
      }
    },

    async confirmPin() {
      if (this.pinDialog === 1) {
        if (chain.loadWallet(this.pin) !== "authError") {
          this.privateKey = chain.wallet().phrase;
          this.privateKeyDialog = true;
          if (!this.$store.state.automatedPIN) {
            this.pinAutomation(this.returnAutomation, this.pin);
          }
        } else {
          this.$root.$emit("error_on", "PIN mismatch.", "red");
        }
        this.showPinDialog = false;
      } else if (this.pinDialog === 3) {
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.check = true;
          this.pinMessage = "Please repeat your new PIN";
          this.pin1 = this.pin;
          this.pin = "";
          this.pinDialog = 4;
          this.showPinDialog = true;
        }
      } else if (this.pinDialog === 10) {
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.check = true;
          this.pinMessage = "Please repeat your new PIN";
          this.pin1 = this.pin;
          this.pin = "";
          this.pinDialog = 11;
          this.showPinDialog = true;
        }
      } else if (this.pinDialog === 11) {
        if (this.pin.length < 4) {
          this.$root.$emit(
            "error_on",
            "PIN must be at least 4 characters long!",
            "red"
          );
        } else {
          this.pin2 = this.pin;
          if (this.pin1 === this.pin2) {
            this.showPinDialog = false;
            this.$refs.mnemonics.$el.focus();
            this.importDialog = true;
          }
        }
      } else if (this.pinDialog === 4) {
        this.pin2 = this.pin;
        if (this.pin1 === this.pin2) {
          this.check = true;
          this.showPinDialog = false;
          this.$root.$emit("progress_on");
          await chain.init(this.pin);
          this.pinned = chain.pinned();
          this.pinAutomation(this.returnAutomation, this.pin);
          this.$root.$emit("walletEvent");
          this.$root.$emit("progress_off");
          this.$root.$emit(
            "error_on",
            "Identity created successfully!",
            "green"
          );
          router.push("/identity");
          if (this.urlChallenge.length > 0) {
            let loginUrl = this.urlChallenge;
            this.urlChallenge = false;
            router.push({
              name: "AppCamera",
              params: { omitCamera: true, challenge: loginUrl }
            });
          }
        } else {
          this.pinDialog = 0;
          this.showPinDialog = false;
          this.pin = "";
          this.$root.$emit("error_on", "PIN mismatch.", "red");
        }
      }
    },

    cancelPin() {
      this.pin1 = "";
      this.pin2 = "";
      this.pin = "";
      this.showPinDialog = false;
    },
    copyStringToClipboard(str) {
      // Create new element
      let el = document.createElement("textarea");
      // Set value (string to be copied)
      el.value = str;
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      // Select text inside element
      el.select();
      // Copy text to clipboard
      try {
        var successful = document.execCommand("copy");
        if (successful) {
          this.$root.$emit("error_on", "Address copied to clipboard.", "green");
        } else {
          this.$root.$emit("error_on", "Could not copy to clipboard!", "red");
        }
      } catch (err) {
        this.$root.$emit("error_on", "Could not copy to clipboard!", "red");
      }
      // Remove temporary element
      document.body.removeChild(el);
    },
    async pinAutomation(check, PIN) {
      if (!this.$store.state.automatedPIN) {
        if (check) {
          this.showPinDialog = false;
          await this.rememberPIN(PIN);
          this.$root.$emit("error_on", "PIN remembered successfully!", "green");
        }
      } else {
        this.$root.$emit(
          "error_on",
          "You cannot remember your PIN, while in PINless mode",
          "red"
        );
      }
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
    returnAutomation() {
      return this.automation;
    },
    returnReturnIdentity() {
      return this.publicAddress;
    }
  }
};
</script>

<style scoped>
.phrase {
  color: darkgray;
}

.active {
  cursor: pointer;
}

.componentTitle {
  margin-top: 8rem;
  margin-left: 1rem;
  margin-right: 1rem;
}

.txtPassword {
  -webkit-text-security: disc;
}

.breakchars {
  overflow-wrap: break-word;
}
</style>
