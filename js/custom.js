$( document ).ready(function() {
  $('#bottom-submit-email-form-desktop').submit(sendDesktopEmail)
  $('#bottom-submit-email-form-mobile').submit(sendMobileEmail)

  $('#bottom-submit-email-btn-desktop').click(sendDesktopEmail)
  $('#bottom-submit-email-btn-mobile').click(sendMobileEmail)

  $('#top-submit-email-btn-desktop').click(sendDesktopEmail)
  $('#top-submit-email-btn-mobile').click(sendMobileEmail)

  $('#top-submit-email-form-desktop').submit(sendDesktopEmail)
  $('#top-submit-email-form-mobile').submit(sendMobileEmail)


  console.log(  $('#top-submit-email-btn-mobile'))
  console.log(  $('#top-submit-email-form-mobile'))

});



function sendDesktopEmail (event) {
  event.preventDefault()


  const email1 = $('#email1').val()
  const email2 = $('#email2').val()
  const email3 = $('#email3').val()
  const email4 = $('#email4').val()

  let email
  if(email1.length){
    email = email1
  } else if (email2.length){
    email = email2
  } else if (email3.length){
    email = email3
  } else if (email4.length) {
    email = email4
  }

  $.ajax({
    type: 'POST',
    url: 'https://api.yup.io/auth/invite_mobile',
    data: { email },
    success: function() {
      $('#email1').val('')
      $('#email2').val('')
      $('#email3').val('')
      $('#email4').val('')

      mixpanel.track('Email Submitted', { '$email': email, email, 'id': email })
      window.location = "signup.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
    }
  })
}

function sendMobileEmail (event) {
  event.preventDefault()

  console.log("WE ARE IN HERE")
  const email1 = $('#email1').val()
  const email2 = $('#email2').val()
  const email3 = $('#email3').val()
  const email4 = $('#email4').val()

  let email
  if(email1.length){
    email = email1
  } else if (email2.length){
    email = email2
  } else if (email3.length){
    email = email3
  } else if (email4.length) {
    email = email4
  }

  $.ajax({
    type: 'POST',
    url: 'https://api.yup.io/auth/invite_mobile',
    data: { email },
    success: function() {
      $('#email1').val('')
      $('#email2').val('')
      $('#email3').val('')
      $('#email4').val('')

      mixpanel.track('Email Submitted', { '$email': email, email, 'id': email })
      window.location = "landing.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
    }
  })
}

function startOAuth() {
  $.ajax({
    type: 'POST',
    url: 'https://api.yup.io/v1/auth/oauth-challenge',
    data: { domain: 'yup.io' },
    success: (data) => {
      const { token, _id: id } = data
      $.ajax({
        type: 'POST',
        url: 'https://api.yup.io/v1/auth/twitter',
        data: { verificationToken: token, verificationId: id, oauthReferrer: 'website' },
        success: (data) => {
          window.open(data.redirectPath, '_blank')
        },
        error: (err) => {
          console.error('twitter verification error: ', err)
          alert("Oops something went wrong! Please try again later.")
        }
      })
    },
    error: (err) => {
      console.error('user authentication error: ', err)
      alert("Oops something went wrong! Please try again later.")
    }
  })
}
