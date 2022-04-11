export const mixinFilterProp = {
  methods: {
    filterProp(el, prop) {
      let need = el.name ? el.name : el;

      if (el && prop && prop.length) {
        if (!prop.includes(need)) return false;

      } else if (!el) return false;

      return true;
    },
  }
}

export const mixinFormatPrice = {
  methods: {
    formatPrice: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
}

export const mixinScrollToCars = {
  methods: {
    scrollToCars() {
        const scrollTarget = document.querySelector(".ml-car-wrap");
        const topOffset = 200;
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        scrollBy({
          top: offsetPosition,
          behavior: 'smooth'
        });
    }
  }
}


export const mixinValidates = {
  data() {
    return {
      actionAfterSend: {
        sendSuccess: false,
        sendError: false
      },
      sendProcess: false,
      errorPhone: false
    }
  },
  methods: {
    resetObject() {
      this.fields = {
        name: "",
        phone: "",
        comment: "",
        agree: ""
      }
    },
    openWindowSuccess() {
      this.modalShow = true;

      setTimeout(() => {
        if (this.modalShow) {
          this.modalShow = false;
        }
      }, 5000);
    },
    checkForm() {
        this.$v.fields.$touch();
        if (!this.fields.agree) this.fields.agree = "";

        if (!this.$v.fields.$error && this.fields.agree && !this.errorPhone) {
          dataLayer.push({'event': 'ga-event', 'Category': 'buycar', 'Action': 'sendok'});

          if (this.get_cookie('_ym_uid')) this.fields['_ym_uid'] = this.get_cookie('_ym_uid');
          if (this.get_cookie('_ga')) this.fields['_ga'] = this.getGa();

          let dataSend = JSON.stringify(this.fields);
          let errorTimeout = setTimeout(() => this.actionAfterSend.sendError = true, 5000);
          this.sendProcess = true;

          try {
            fetch(this.$requestUrl + '?data=send', {
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              method: 'POST',
              body: "body=" + dataSend
            }).then(r => r.json())
              .then(r => {
                if (r.status == 'success') {
                  this.actionAfterSend.sendSuccess = true;
                  this.resetObject();
                  this.$v.$reset();
                } else {
                  this.actionAfterSend.sendError = true;
                }
              })
              .catch(e => {
                this.actionAfterSend.sendError = true;
                console.log(e.message);
              })
              .finally(() => {
                clearTimeout(errorTimeout);
                this.openWindowSuccess();
                this.sendProcess = false;
              })
          } catch (e) {
            this.actionAfterSend.sendError = true;
            this.sendProcess = false;
            clearTimeout(errorTimeout);
            console.log(e.message);
          }

        }
    },
    maskCheck(field) {
      let unmasked = field.target.inputmask.unmaskedvalue();

      this.errorPhone = unmasked.length < 10;
    },
    get_cookie(cookie_name) {
      let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

      return results ? unescape(results[2]) : null;
    },
    getGa() {
      let cidLong = this.get_cookie('_ga');
      let tmp = cidLong.split('.');

      return tmp[2] + '.' + tmp[3];
    }
  },
  mounted() {
    if (this.get_cookie('_ym_uid')) {
      this.fields['_ym_uid'] = this.get_cookie('_ym_uid');
    }
    if (this.get_cookie('_ga')) {
      this.fields['_ga'] = this.getGa();
    }
  }
}
