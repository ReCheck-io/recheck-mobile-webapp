<template>
  <div class="componentTitle">
    <div style="margin:5rem;" />
    <v-card dark class="rounded-card">
      <v-toolbar color="#16415c" fflat>
        <v-toolbar-title class="white--text">About</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div style="margin-top:20px;" />
        <div class="breakchars">
          <p>
            ReCheck Mobile is a webapp that keeps your set of keys, not allowing anyone, but you, to 
            have a look at them. This app is used for authentication of transaction as well as to put
            your digital signature on a file as a means of verification. 
          </p>
          <br>
          <p>
            ReCheck service is available as self-hosted solution or as SaaS for corporate
            customers. Please contact ReCheck's customer service for more information at
            info@recheck.io or call us on +359887583316.
          </p>
        </div>
        <div style="margin-top:20px;" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style>
.componentTitle {
  margin-top: 8rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
ul
{
text-align: left;
}

</style>
