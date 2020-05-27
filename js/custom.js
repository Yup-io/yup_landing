$( document ).ready(function() {
  $( '#btn-submit-email').click(sendMobileEmail)
  // const formIds = ['emiailForm1', 'emailForm2', 'emailForm3']
  $('#emailForm1').submit(sendMobileEmail)
  $('#emailForm2').submit(sendMobileEmail)
  $('#emailForm3').submit(sendMobileEmail)
});


function sendMobileEmail (event) {
  event.preventDefault()

  console.log('WE HAVE BEEN SUBMITTED')

  const email1 = $('#email1').val()
  const email2 = $('#email2').val()
  const email3 = $('#email3').val()

  const email = email1.length ? email1 :
    email2.length ? email2 : email3

  $.ajax({
    type: 'POST',
    url: 'https://api.yup.io/auth/invite_mobile',
    data: { email },
    success: function() {

      console.log("WE ARE IN HERE")
      const email1 = $('#email1').val('')
      const email2 = $('#email2').val('')
      const email3 = $('#email3').val('')
      window.location = "landing.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
    }
  })
}
