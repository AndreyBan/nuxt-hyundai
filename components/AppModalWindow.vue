<template>
  <div class="modal-window" :class="{'modal-hidden': hideModal}">
    <div class="modal-wrap">
      <div class="modal-close" @click="closeModal"></div>
      <div class="c-modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppModalWindow",
  data: () => ({
    hideModal: false
  }),
  methods: {
    disableOverFlow(str) {
      document.querySelector('body').style.overflow = str;

      if (matchMedia("(min-width: 1025px)").matches) {
        let $html = document.querySelector('html');

        if (str === 'hidden') {
          $html.style.marginRight = '17px';
        } else {
          $html.style.marginRight = '0';
        }

      }
    },
    closeModal() {
      new Promise(resolve => {
        this.hideModal = true;
        resolve();

      }).then(() => {
        setTimeout(() => {
          this.$emit('close-modal');

        }, 200);

      });
    }

  },
  mounted() {
    this.disableOverFlow('hidden');
  },
  destroyed() {
    this.disableOverFlow('auto');
  }
}
</script>
<style scoped>
.modal-window {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .6);
  z-index: 1000000000;
  opacity: 0;
  animation: show ease-in .2s forwards;
}
.c-modal-content{
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, .25);
}
.modal-window.modal-hidden {
  animation: hide ease-out .2s forwards;
}

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.modal-wrap {
  background-color: #FFFFFF;
  max-width: 600px;
  position: relative;
}

.modal-close {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
  z-index: 11;
  cursor: pointer;
}

.modal-close:before,
.modal-close:after {
  content: '';
  position: absolute;
  height: 100%;
  width: 1px;
  left: 12px;
  background-color: #000000;
}

.modal-close:before {
  transform: rotate(45deg);
}

.modal-close:after {
  transform: rotate(-45deg);
}



@media (max-width: 767px) {
  .modal-wrap {
    width: 100%;
  }
  .modal-close {
    top: 36px;
  }
}
</style>
