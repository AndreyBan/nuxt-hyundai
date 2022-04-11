<template>
  <div class="range-slider-wrap">
    <div class="range-slider__title">Цена</div>
    <div class="track-container">
      <input type="text" class="range-value min" @change="setTrackButtons($event)" v-model="minValue">
      <input type="text" class="range-value max" @change="setTrackButtons($event)" v-model="maxValue">
      <div class="track" ref="_vpcTrack"></div>
      <div class="track-highlight" ref="trackHighlight"></div>
      <button class="track-btn track1" ref="track1"></button>
      <button class="track-btn track2" ref="track2"></button>
    </div>
  </div>
</template>

<script>

export default {
  name: "AppPriceRange",
  props: {
    trackHeight: {
      type: Number,
      default: 1
    },
    minPrice: {
      type: Number,
      default: 1
    },
    maxPrice: {
      type: Number,
      default: 1
    },
    reset: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      min: this.minPrice,
      max: this.maxPrice,
      minValue: this.minPrice,
      maxValue: this.maxPrice,
      step: 1000,
      totalSteps: 10,
      percentPerStep: 10,
      trackWidth: 0,
      isDragging: false,
      pos: {
        curTrack: null
      }
    }
  },
  methods: {
    moveTrack(track, ev) {
      let percentInPx = this.getPercentInPx();
      let trackX = Math.round(this.$refs._vpcTrack.getBoundingClientRect().left);
      let clientX = ev.clientX;
      let moveDiff = clientX - trackX;

      let moveInPct = moveDiff / percentInPx
      let value = (Math.round(moveInPct / this.percentPerStep) * this.step) + this.min;

      if (track === 'track1') {
        if (moveInPct < 0) {
          this.$refs[track].style.left = '0';
          this.setTrackHightlight()
          this.minValue = this.min;

          return false;
        }

        if (value >= (this.maxValue - this.step)) return false;
        this.minValue = value;
      } else {
        if (moveInPct > 100) {
          this.$refs[track].style.left = '100%';
          this.setTrackHightlight()
          this.maxValue = this.max;

          return false;
        }

        if (value < (this.minValue + this.step)) return false;
        this.maxValue = value;
      }

      this.$refs[track].style.left = moveInPct + '%';
      this.setTrackHightlight()

    },
    mousedown(ev, track) {
      if (this.isDragging) return;
      this.isDragging = true;
      this.pos.curTrack = track;
    },

    touchstart(ev, track) {
      this.mousedown(ev, track)
    },

    mouseup() {
      this.priceEmit(Number(this.minValue), Number(this.maxValue));
      if (!this.isDragging) return;
      this.isDragging = false
    },

    touchend(ev, track) {
      this.mouseup(ev, track)
    },

    mousemove(ev, track) {
      if (!this.isDragging) return;
      this.moveTrack(track, ev)
    },

    touchmove(ev, track) {
      this.mousemove(ev.changedTouches[0], track)
    },

    valueToPercent(value) {
      return ((value - this.min) / this.step) * this.percentPerStep
    },

    setTrackHightlight() {
      this.$refs.trackHighlight.style.left = this.valueToPercent(this.minValue) + '%'
      this.$refs.trackHighlight.style.width = (this.valueToPercent(this.maxValue) - this.valueToPercent(this.minValue)) + '%'
    },

    getPercentInPx() {
      let trackWidth = this.$refs._vpcTrack.offsetWidth;
      let oneStepInPx = trackWidth / this.totalSteps;
      // 1 percent in px
      return oneStepInPx / this.percentPerStep;
    },

    setClickMove(ev) {
      let track1Left = this.$refs.track1.getBoundingClientRect().left;
      let track2Left = this.$refs.track2.getBoundingClientRect().left;

      if (ev.clientX < track1Left) {
        this.moveTrack('track1', ev)
      } else if ((ev.clientX - track1Left) < (track2Left - ev.clientX)) {
        this.moveTrack('track1', ev)
      } else {
        this.moveTrack('track2', ev)
      }

      this.priceEmit(Number(this.minValue), Number(this.maxValue));
    },
    setTrackButtons(e) {
      let maxVal = Number(this.maxValue);
      let minVal = Number(this.minValue);


      if (maxVal > this.max || minVal < this.min) {
        this.maxValue = this.max;
        this.minValue = this.min;

        // return false;
      }

      if (e) {
        if (e.target.className.includes('max') && maxVal <= minVal) {
          this.maxValue = minVal + Number(this.step);

        } else if (e.target.className.includes('min') && minVal >= maxVal) {
          this.minValue = maxVal - Number(this.step);
        }

        this.priceEmit(Number(this.minValue), Number(this.maxValue));

      }

      this.$refs.track1.style.left = this.valueToPercent(Number(this.minValue)) + '%'
      this.$refs.track2.style.left = this.valueToPercent(Number(this.maxValue)) + '%'
      this.setTrackHightlight();
    },
    priceEmit(min, max) {
      this.$emit('up-price', {
        priceMax: max,
        priceMin: min,
      })
    },
    resetRange(){
      this.totalSteps = (this.max - this.min) / this.step;
      this.percentPerStep = 100 / this.totalSteps;

      this.setTrackButtons();
      this.$refs.track1.style.left = this.valueToPercent(Number(this.minValue)) + '%'
      this.$refs.track2.style.left = this.valueToPercent(Number(this.maxValue)) + '%'
      this.setTrackHightlight();
    }
  },
  watch: {
    reset(){
      if (this.reset){
        this.minValue = this.min
        this.maxValue = this.max
        this.resetRange();
      }
    },
    minPrice(){
      this.min = this.minPrice;

      if (Number(this.minValue) < this.min){
        this.minValue = this.min
      }

      this.resetRange();
    },
    maxPrice(){
      this.max = this.maxPrice;

      if (Number(this.maxValue) > this.max){
        this.maxValue = this.max;
      }

      this.resetRange();
    }
  },
  mounted() {
    // calc per step value
    this.totalSteps = (this.max - this.min) / this.step;

    // percent the track button to be moved on each step
    this.percentPerStep = 100 / this.totalSteps;

    this.setTrackButtons()

    let self = this;

    ['mouseup', 'mousemove'].forEach(type => {
      document.body.addEventListener(type, (ev) => {
        ev.preventDefault();
        if (self.isDragging && self.pos.curTrack) {
          self[type](ev, self.pos.curTrack)
        }
      })
    });

    ['mousedown', 'mouseup', 'touchstart', 'touchmove', 'touchend'].forEach(type => {
      document.querySelector('.track1').addEventListener(type, (ev) => {
        ev.stopPropagation();
        self[type](ev, 'track1')
      })

      document.querySelector('.track2').addEventListener(type, (ev) => {
        ev.stopPropagation();
        self[type](ev, 'track2')
      })
    })

    document.querySelector('.track').addEventListener('click', function (ev) {
      ev.stopPropagation();
      self.setClickMove(ev)

    })

    document.querySelector('.track-highlight').addEventListener('click', function (ev) {
      ev.stopPropagation();
      self.setClickMove(ev)

    })
  }
};
</script>

<style>

.track-container .range-value {
  background: transparent;
  width: 45%;
}

.range-value {
  position: absolute;
  bottom: 12px;
  border: none;
  font-size: 16px;
}

.range-value:focus,
.range-value:active,
.range-value:focus-visible {
  border: none;
  outline: none;
}

.range-slider__title {
  font-size: 14px;
  margin-bottom: 14px;
}

.range-value.min {
  left: 17px;
}

.range-value.max {
  right: 17px;
  text-align: right;
}

.range-slider-wrap {
  margin-bottom: 24px;
  max-width: 230px;
  width: 100%;
}

.track-container {
  width: 100%;
  position: relative;
  cursor: pointer;
  border: 1px solid #B7B7B7;
  height: 43px;

}

.track,
.track-highlight {
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -1px;
}


.track-highlight {
  background-color: #003469;
  z-index: 2;
}

.track-btn {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  display: block;
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  bottom: -12px;
  border: none;
  background-color: #ffffff;
  -ms-touch-action: pan-x;
  touch-action: pan-x;
  -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
}

.track1 {
  margin-left: -6px;
}

.track2 {
  margin-left: -22px;
}

.track-btn:before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #003469;
  border-radius: 50%;
  left: 6px;
  top: 6px;
}

@media (max-width: 991px) {
  .range-value {
    width: 50%;
  }

  .range-slider-wrap {
    margin-top: 12px;
    max-width: 100%;
  }
}

</style>
