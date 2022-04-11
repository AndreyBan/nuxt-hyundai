<template>
  <div class="preload-wrap" v-show="show">
    <div class="sk-double-bounce">
      <div class="sk-child sk-double-bounce-1"></div>
      <div class="sk-child sk-double-bounce-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppPreloadResponse",
  props: {
    sendProcess: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      show: this.sendProcess
    }
  },
  watch: {
    sendProcess(){
      this.show = this.sendProcess
    }
  }
}
</script>

<style scoped lang="scss">
$spinkit-size: 6em !default;
$spinkit-spinner-color: #65abf8 !default;

.preload-wrap{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,.75);
  z-index: 10;
  transition-duration: .3s;
}

.sk-double-bounce {
  width: $spinkit-size;
  height: $spinkit-size;
  position: relative;
  margin: auto;

.sk-child {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: $spinkit-spinner-color;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: sk-double-bounce 2.0s infinite ease-in-out;
}

.sk-double-bounce-2 {
  animation-delay: -1.0s;
}
}

@keyframes sk-double-bounce {
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.0);
  }
}

</style>
