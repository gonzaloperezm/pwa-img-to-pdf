<template>
  <div id="app" class="container mt-5">
    <h1 class="text-center mb-4">Convert Images to PDF</h1>
    <FileUploader />
  </div>
</template>

<script>
import FileUploader from './components/FileUploader.vue';

export default {
  components: {
    FileUploader
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
#app {
  font-family: 'Quicksand', sans-serif;
}
</style>
