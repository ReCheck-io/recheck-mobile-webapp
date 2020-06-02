<template>
  <div>
    <v-toolbar color="#16415c" dark fixed>
      <v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title 
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ active: hover }" @click="atHome"
      >Recheck Mobile</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/">
        <v-btn flat icon>
          <v-badge overlap color="orange" v-model="badge">
            <template v-slot:badge>
              <v-icon dark small>notifications</v-icon>
            </template>
            <v-icon>camera</v-icon>
          </v-badge>
        </v-btn>
      </router-link>
    </v-toolbar>

    <!-- Nav Drawer -->
    <v-navigation-drawer v-model="drawer" app dark>
       <v-toolbar  color="#16415c">
          <v-btn icon dark @click="drawer = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
      <v-list>
        <v-list-tile 
        v-for="link in links"
        :key="link.text"
        router :to ="link.route"
        @click="drawer = false"
        >
          <v-list-tile-action>
            <v-icon class="white--text">{{link.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-tile class="white--text">{{link.text}}</v-list-tile-tile>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import router from '../router';

export default {
  data() {
    return {
      badge: false,
      drawer: false,
      hover:false,
      // https://material.io/resources/icons/?style=baseline
      links:[
        {icon:'home', text:'Home', route:'/home'},
        {icon:'assignment_ind', text:'My Identity', route:'/identity'},
        {icon:'settings_applications', text:'Security Settings', route:'/securitysettings'},
        {icon:'notes', text:'Terms and Privacy', route:'/privacy'},
        {icon:'help', text:'Help', route:'/help'},
        
        // {icon:'supervisor_account', text:'Contacts', route:'/identity'},
      ]
    };
  },
  mounted() {
    this.$root.$on("badge_on", () => {
      this.badge = true;
    });
    this.$root.$on("badge_off", () => {
      this.badge = false;
    });
  },
  methods:{
    atHome(){
      router.push("/");
    }
  }
  
};
</script>


<style scoped>
a {
  text-decoration: none;
}
.active {
  cursor:pointer;
}

</style>
