function tosModalShow() {
  document.getElementById('tos-modal').showModal()
}

function tosModalValidate() {
  try {
    var tosAccepted = document.querySelector('input[name=tos-accepted]')
    var button = document.getElementById('disclaimer-button')

    if (tosAccepted.checked) {
      button.disabled = false
      button.className = 'nes-btn is-primary'
    } else {
      button.disabled = true
      button.className = 'nes-btn is-disabled'
    }
  } catch (err) {
    console.error(err)
  }
}

function initCountdowns() {
  /*window.countdowns = {
    '0': moment("2020-09-06 13:00:00"),
    '1': moment("2020-09-06 13:00:00"),
    '3': moment("2020-09-06 13:00:00"),
    '4': moment("2020-09-06 13:00:00"),
    '5': moment("2020-09-06 13:00:00") 
  }
  setInterval(updateCountdowns, 1000)*/
}

function leadZero(num) {
  return num < 10 ? '0'+num : num
}

function updateCountdowns() {
  /*Object.keys(window.countdowns).forEach(function(key) {
    var duration = moment.duration(window.countdowns[key].unix() - moment().unix(), 'seconds');
    var countdown = leadZero(duration.hours()) + ":" + leadZero(duration.minutes()) + ":" + leadZero(duration.seconds())
    if (duration.days() > 0) {
      countdown = duration.days() + "d " + countdown
    }
    
    $('.countdown' + key).text(countdown)
  })*/
}

function registerDialogPolyfill() {
  [].forEach.call(document.querySelectorAll('dialog'), (a) => {
    dialogPolyfill.registerDialog(a);
  });
}

;(function ($) {
  $.fn.animateNumbers = function (stop, commas, duration, ease) {
    return this.each(function () {
      var $this = $(this)
      var isInput = $this.is('input')
      var start = parseInt(
        isInput ? $this.val().replace(/,/g, '') : $this.text().replace(/,/g, '')
      )
      var regex = /(\d)(?=(\d\d\d)+(?!\d))/g
      commas = commas === undefined ? true : commas

      // number inputs can't have commas or it blanks out
      if (isInput && $this[0].type === 'number') {
        commas = false
      }

      $({
        value: start,
      }).animate(
        {
          value: stop,
        },
        {
          duration: duration === undefined ? 1000 : duration,
          easing: ease === undefined ? 'swing' : ease,
          step: function () {
            isInput
              ? $this.val(Math.floor(this.value))
              : $this.text(Math.floor(this.value))
            if (commas) {
              isInput
                ? $this.val($this.val().replace(regex, '$1,'))
                : $this.text($this.text().replace(regex, '$1,'))
            }
          },
          complete: function () {
            if (
              parseInt($this.text()) !== stop ||
              parseInt($this.val()) !== stop
            ) {
              isInput ? $this.val(stop) : $this.text(stop)
              if (commas) {
                isInput
                  ? $this.val($this.val().replace(regex, '$1,'))
                  : $this.text($this.text().replace(regex, '$1,'))
              }
            }
          },
        }
      )
    })
  }
})(jQuery)

jQuery(document).ready(function () {
  moment.tz.setDefault("Europe/London");
  //initCountdowns()
  registerDialogPolyfill();

//   if (!window.localStorage.getItem('accepted')) {
//     tosModalShow()
//   }
})
