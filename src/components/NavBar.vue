navbar

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="sidebarMenu"
        app
        color="grey lighten-2"
      >
        <v-list density="compact" nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            @click="navigate(item.route)"
            :class="{ 'v-list-item--active': isActive(item.route) }"
            link
          >
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="font-bold">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- App Bar -->
      <v-app-bar class="bg-primary" prominent>
        <v-app-bar-nav-icon
            variant="text"
            @click.stop="sidebarMenu = !sidebarMenu"
          ></v-app-bar-nav-icon>
        <v-toolbar-title>
          My Dashboard
        </v-toolbar-title>
      </v-app-bar>


      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
// const display = useDisplay();

const sidebarMenu = ref(true);

const user = ref({});

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
});

const menuItems = [
  { title: 'DASHBOARD', route: '/dashboard', icon: 'mdi-home' },
  { title: 'GradeBook', route: '/dashboard/gradeBook', icon: 'mdi-book' },
  { title: 'Attendance', route: '/dashboard/attenDance', icon: 'mdi-calendar-check' },
  { title: 'Behavior', route: '/dashboard/behavior', icon: 'mdi-emoticon-happy' },
];

const navigate = (path) => {
  router.push(path);
};

const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.v-list-item--active {
  background-color: #1976d2;
  color: white;
}


</style>
