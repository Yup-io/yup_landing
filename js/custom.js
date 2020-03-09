$( document ).ready(function() {
    const form = document.getElementById('emailForm');
    form.addEventListener('submit', sendMobileEmail);
    const form2 = document.getElementById('emailForm2');
    form2.addEventListener('submit', sendMobileEmail);
});



function sendMobileEmail (event) {
  event.preventDefault()

  let email

  const email1 = $('#email55').val()
  const email2 = $('#email56').val()

  if (email1 && email1.length > 0){
    email = email1
  } else {
    email = email2
  }

  $.ajax({
    type: 'POST',
    url: 'https://api.yup.io/auth/invite_mobile',
    data: { email },
    success: function() {
      const email1 = $('#email55').val('')
      const email2 = $('#email56').empty('')
      window.location = "landing.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
    }
  })
}
