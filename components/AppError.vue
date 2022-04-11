<template>
  <div class="error-message"><slot>Произошла ошибка загрузки данных!</slot></div>
</template>

<script>
export default {
  name: "AppError"
}
</script>

<style scoped>
.error-message {
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  grid-column: 1/5;
  padding: 50px 0;
}
</style>
