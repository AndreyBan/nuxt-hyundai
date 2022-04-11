<template>
  <Nuxt keep-alive  :keep-alive-props="{ include: $route.meta.keepComponents }"  />
</template>
