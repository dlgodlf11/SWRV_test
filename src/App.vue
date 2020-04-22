<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item :to="'/'" link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>SWRV</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="'/CheckBody'" link>
          <v-list-item-action>
            <v-icon>mdi-human</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Measure</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-side-icon>
        <v-img :src="require('./assets/swrv_logo.png')" class="mr-3" height="30px" width="30px" />
      </v-toolbar-side-icon>
      <router-link id="toolbar_title" to="/">
        <v-toolbar-title>SWRV</v-toolbar-title>
      </router-link>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <span
        class="fontresize"
      >(주) 스월브 | CEO : 윤지현 | LINK : www.swrvio.com, 부산 남구 전포대로 133, 제오피스호 13층(문현동) | CONTACT : +82 10-9520-3919</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    Measurelink: "/Measure"
  }),
  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
<style>
.fontresize {
  font-size: 2.6vw;
  font-size: 14px;
}
#toolbar_title {
  color: inherit;
  text-decoration: inherit;
}
</style>