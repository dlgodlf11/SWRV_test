<template>
  <div class="home">
    <HelloGuest />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloGuest from "@/components/HelloGuest.vue";

export default {
  name: "Home",
  components: {
    HelloGuest
  }
};
</script>
