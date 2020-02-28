function sendMobileEmail () {
  $.ajax({
    type: 'POST',
    url: 'http://api.yup.io/auth/invite_mobile',
    success: function() {
      window.location = "landing.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
    }
  })
}
