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
      Rollbar.error(`Failed to send mobile invite err=${error}`)
      console.error(`Failed to send mobile invite err=${error}`)
    }
  })
}

function sendMobileEmail (event) {
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
      window.location = "landing.html"
    },
    error: function (xml, status, error) {
      alert("Oops something went wrong! Please try again later.")
      Rollbar.error(`Failed to send mobile invite err=${error}`)
      console.error(`Failed to send mobile invite err=${error}`)
    }
  })
}


async function startOAuth() {
  try {
    if (window.twitterOAuthRedirect){
      fetchOAuthToken()
      window.open(window.twitterOAuthRedirect)
    }
  } catch (err) {
    console.error('twitter verification error: ', err)
    alert("Oops something went wrong! Please try again later.")
    Rollbar.error(`Failed to verify twitter OAuth token err=${err}`)
  }
}

async function fetchOAuthToken() {
  try {
    const oauthTokenData = (await axios.post(`https://api.yup.io/v1/auth/oauth-challenge`, {
      domain: 'yup.io'
    })).data
    const { token, _id: id } = oauthTokenData
    const oauthRedirectInfo = (await axios.post('https://api.yup.io/v1/auth/twitter',
    {
      verificationToken: token, verificationId: id, oauthReferrer: 'website'
  })).data

    window.twitterOAuthRedirect = oauthRedirectInfo.redirectPath
  } catch (err){
    console.error(`Failed to fetch twitter OAuth token err=${err}`)
    Rollbar.error(`Failed to fetch twitter OAuth token err=${err}`)
  }

}

fetchOAuthToken()

$(document).ready(async function() { 
  let totalOpinions = Number(await $.get('https://api.yup.io/metrics/total-votes'))
  let totalRewards =  await $.get('https://api.yup.io/metrics/total-curator-rewards')
  let metricsArr  = [ totalOpinions, totalRewards.totalCuratorRewardsUSD ]

  initMetrics()
  setInterval(updateMetrics, 5000)

  
  function initMetrics () {
    $('.count').each(function (index) {
      var $this = $(this);
      jQuery({ Counter: 10000 }).animate({ Counter: metricsArr[index]}, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $this.text(formatMetric(Math.ceil(this.Counter)))
        }
      });
    });
  }
  function updateMetrics () {
    $('.count.update').each(function (index) {
      var $this = $(this);
      jQuery({ Counter: metricsArr[index] }).animate({ Counter: metricsArr[index]}, {
        duration: 1000,
        easing: 'swing',
        step: function () {
          $this.text(formatMetric(Math.ceil(this.Counter)))
        }
      });
    });
    metricsArr = metricsArr.map((item) => item + Math.floor(Math.random() * 2 ) + 1)
  }

  function formatMetric (metric)  {
    let num = metric.toString()
    const length = num.length
    const formattedMetric = num.slice(0, length/2) + ',' + num.slice(length/2, length)
    return formattedMetric
  }
})
