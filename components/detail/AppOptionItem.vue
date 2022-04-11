<template>
    <li v-if="name" :class="{'open': isOpen}" @click="isOpen = !isOpen">
      <span class="title-upper">{{ name }}</span>
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li>
      </ul>
    </li>
</template>

<script>
export default {
  name: "AppOptionItem",
  data: () => ({
    isOpen: false
  }),
  props: {
    name: {
      type: String,
      default: ""
    },
    list: {
      type: Array
    }
  }
}
</script>

<style scoped>

.extra-options__list ul {
  list-style: none;
}

.extra-options__list > ul {
  margin-top: 10px;
}

.extra-options__list > li:not(:first-child) {
  margin-top: 12px;
}

.extra-options__list > li {
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E5E5E5;
  font-weight: 500;
  padding-left: 32px;
  position: relative;
  cursor: pointer;
}

.title-upper{
  text-transform: uppercase;
}

.extra-options__list > li:after {
  content: "";
  position: absolute;
  right: 0;
  top: 3px;
  background: url("/images/instock/select-arrow.svg") 0 0 no-repeat;
  width: 15px;
  height: 9px;
  transition-duration: .2s;
}


.extra-options__list > li.open:after {
  transform: rotate(180deg);
}

.extra-options__list > li ul {
  padding-left: 0;
  max-width: 474px;
  width: 100%;
  margin-bottom: 0;
  display: none;
}

.extra-options__list > li.open ul {
  display: block;
  margin-top: 14px;
}

.extra-options__list > li ul li {
  padding-bottom: 8px;
  position: relative;
  font-weight: 400;
  padding-right: 24px;
}

.extra-options__list > li ul li:after {
  content: '+';
  position: absolute;
  right: 0;
  color: #00AAD2;
}
</style>
