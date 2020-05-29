<template>
  <div>
    <div v-if="error.length > 0" style="margin: 5rem 1rem 1rem 1rem;">
      <div style="margin-top: 20px">
        <v-card dark class="rounded-card">
          <v-toolbar color="red" flat>
            <v-toolbar-title class="white--text">Problem with camera</v-toolbar-title>
          </v-toolbar>
          <v-card-text>The camera could not be initialized. Please make sure you permit usage of your phone camera by setting Camera Permission to state "Allowed". You can do so by selecting "Site Settings" from the browser settings menu or by clicking the site security icon located left of the address bar.</v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div v-if="!pinned" style="margin: 5rem 1rem 1rem 1rem;">
      <div style="margin-top: 20px">
        <v-card dark class="rounded-card">
          <v-toolbar color="red" flat>
            <v-toolbar-title class="white--text">Identity Required</v-toolbar-title>
          </v-toolbar>
          <v-card-text>To start using the camera you have to setup a new digital identity.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link to="/identity">
              <v-btn dark color="blue">Identity Settings</v-btn>
            </router-link>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <v-layout v-if="pinned && !omitCamera" row justify-center style="margin:5rem 3rem 3rem">
      <qrcode-stream @decode="onDecode" @init="onInit" />
    </v-layout>
    <v-dialog
      persistent
      data-app="true"
      v-model="dialog"
      :max-width="options.width"
      @keydown.esc="cancel"
      v-bind:style="{ zIndex: options.zIndex }"
    >
      <v-card>
        <v-toolbar dark :color="options.color" dense flat>
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!message">{{ message }}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" dark @click.native="cancel">Cancel</v-btn>
          <v-btn color="blue" dark @click.native="agree">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row justify-center>
      <v-dialog v-model="this.showPinDialog" @keydown.esc="cancel" persistent max-width="600px">
        <v-card>
          <v-toolbar dark dense flat>
            <v-toolbar-title class="white--text">Your PIN</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    type="password"
                    v-model="pin"
                    label="PIN"
                    hint="Please enter your PIN."
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" dark @click="cancelPin">Cancel</v-btn>
            <v-btn color="blue" dark @click="confirmPin">Confirm</v-btn>
          </v-card-actions>
          <v-card-actions v-if="!this.$store.state.automatedPIN">
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
import router from "../router";
import chain from "../chain";
import Console from "../logger";

export default {
  mounted() {
    chain.setURLandNetwork(this.environment[0], this.environment[1]);
    this.pinned = chain.pinned();
    this.$root.$emit("badge_off");
    Console.log("mounted: omitCamera", this.omitCamera);
    if (this.omitCamera) {
      this.onDecode(this.urlChallenge);
    }
  },

  data() {
    return {
      omitCamera: this.$route.params.omitCamera,
      urlChallenge: this.$route.params.challenge,
      environment: process.env.NODE_ENV.split(","),
      error: "",
      dialog: false,
      hint: false,
      automation: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: "primary",
        width: 290,
        zIndex: 200
      },
      inited: false,
      pin: "",
      showPinDialog: false,
      qrResult: "",
      pinned: false,
      pinCase: "login"
    };
  },

  methods: {
    async onInit(promise) {
      if (this.omitCamera) return;
      try {
        this.inited = true;
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },

    doLogin() {
      this.$root.$emit("progress_on");

      chain.doLogin(this.pin, this.qrResult, err => {
        this.$root.$emit("progress_off");
        if (!err) {
          this.$root.$emit(
            "error_on",
            "Login data sent successfully.",
            "green"
          );
          router.push("/");
        } else {
          if (err == "authError") {
            this.$root.$emit("error_on", "PIN mismatch!", "red");
          } else {
            this.$root.$emit("error_on", "Unable to send login data", "red");
          }
          router.push("/");
        }
      });
      this.pin = "";
    },

    doExecSelection() {
      this.$root.$emit("progress_on");

      chain.doExecSelection(this.pin, this.qrResult, err => {
        this.$root.$emit("progress_off");
        if (!err) {
          if (this.pinCase === "decrypt") {
            this.$root.$emit(
              "error_on",
              "Decrypted data successfully.",
              "green"
            );
          } else if (this.pinCase === "share") {
            this.$root.$emit("error_on", "Shared data successfully.", "green");
          } else if (this.pinCase === "sign") {
            this.$root.$emit("error_on", "Signed data successfully.", "green");
          }
          router.push("/");
        } else {
          if (err == "authError") {
            this.$root.$emit("error_on", "PIN mismatch!", "red");
          } else {
            if (this.pinCase === "decrypt") {
              this.$root.$emit("error_on", "Failed to decrypt data.", "red");
            } else if (this.pinCase === "share") {
              this.$root.$emit("error_on", "Failed to share data.", "red");
            } else if (this.pinCase === "sign") {
              this.$root.$emit("error_on", "Failed to sign data.", "red");
            } else if (this.pin < 4) {
              this.$root.$emit("error_on", "PIN mismatch!", "red");
            }
          }
          router.push("/");
        }
      });
      this.pin = "";
    },

    onDecode(qrResult) {
      Console.log("qrResult", qrResult);
      this.qrResult = qrResult;
      if (qrResult.indexOf("/login") > 0) {
        this.pinCase = "login";
        this.open("Login Request", "You are about to login. Are you sure?")
          .then(resolved => {
            if (resolved) {
              if (chain.pinned() && !this.$store.state.automatedPIN) {
                this.showPinDialog = true;
              } else {
                this.confirmPin();
              }
            } else {
              router.push("/");
            }
          })
          .catch(() => {
            this.$root.$emit("progress_off");
            router.push("/");
          });
      } else if (qrResult.startsWith("sh:")) {
        this.pinCase = "share";
        this.open(
          "Document Share Request",
          "You are about to share a document. Are you sure?"
        )
          .then(resolved => {
            if (resolved) {
              if (chain.pinned() && !this.$store.state.automatedPIN) {
                this.showPinDialog = true;
              } else {
                this.confirmPin();
              }
              3000;
            } else {
              Console.log("AFTER LOGIN");
              router.push("/");
            }
          })
          .catch(() => {
            this.$root.$emit("progress_off");
            router.push("/");
          });
      } else if (qrResult.startsWith("sg:")) {
        this.pinCase = "sign";
        this.open(
          "File Sign Request",
          "You are about to sign a file. Are you sure?"
        )
          .then(resolved => {
            if (resolved) {
              if (chain.pinned() && !this.$store.state.automatedPIN) {
                this.showPinDialog = true;
              } else {
                this.confirmPin();
              }
            } else {
              Console.log("AFTER LOGIN");
              router.push("/");
            }
          })
          .catch(() => {
            this.$root.$emit("progress_off");
            router.push("/");
          });
      } else if (qrResult.startsWith("re:")) {
        this.pinCase = "decrypt";
        this.open(
          "Document Decrypt Request",
          "You are about to decrypt a document. Are you sure?"
        )
          .then(resolved => {
            if (resolved) {
              if (chain.pinned() && !this.$store.state.automatedPIN) {
                this.showPinDialog = true;
              } else {
                this.confirmPin();
              }
            } else {
              Console.log("AFTER LOGIN");
              router.push("/");
            }
          })
          .catch(() => {
            this.$root.$emit("progress_off");
            router.push("/");
          });
      }
    },

    confirmPin() {
      if (this.$store.state.automatedPIN) {
        this.pin = this.returnRememberedPIN;
      }

      if (this.checkPin(this.pin)) {
        if (chain.checkPassword(this.pin)) {
          if (this.returnAutomation) {
            this.pinAutomation(this.pin);
          }
          if (this.pinCase === "login") {
            this.doLogin();
          } else if (this.pinCase === "decrypt") {
            this.doExecSelection();
          } else if (this.pinCase === "share") {
            this.doExecSelection();
          } else if (this.pinCase === "sign") {
            this.doExecSelection();
          }
          this.showPinDialog = false;
        } else {
          this.$root.$emit("error_on", "PIN is incorrect!", "red");
          this.showPinDialog = false;
          this.pinCase = "";
          router.push("/");
        }
      } else {
        this.$root.$emit("error_on", "PIN is incorrect!", "red");
        this.showPinDialog = false;
        this.pinCase = "";
        router.push("/");
      }
    },

    cancelPin() {
      this.pin = "";
      this.showPinDialog = false;
    },

    checkPin(pin) {
      if (pin === "") {
        return false;
      } else {
        if (pin === undefined) {
          return false;
        } else {
          if (pin.length < 3) {
            return false;
          } else {
            return true;
          }
        }
      }
    },

    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    agree() {
      this.resolve(true);
      this.dialog = false;
    },

    cancel() {
      this.resolve(false);
      this.dialog = false;
      this.result = "";
    },
    async pinAutomation(PIN) {
      if (!this.$store.state.automatedPIN) {
        this.showPinDialog = false;
        await this.rememberPIN(PIN);
        this.$root.$emit("error_on", "PIN remembered successfully!", "green");
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
    }
  }
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}

.txtPassword {
  -webkit-text-security: disc;
}

a {
  text-decoration: none;
}
</style>
