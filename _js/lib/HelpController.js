import $ from 'jquery'

function HelpController() {
  const $help = jQuery('#keyboardHelp')
  $help.modal({ show: false })

  $(document).keypress(openHelp)

  function openHelp(event) {
    const $target = $(event.target)
    const key = event.which
    if ($target.is(':input') || $('.modal:visible').length !== 0) {
      // ignore
    } else if (key === 63) {
      event.preventDefault()
      event.stopPropagation()

      $help.modal('show')
    }
  }
}

export default HelpController
