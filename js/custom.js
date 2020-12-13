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
  // ===== METRICS ==== //
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
        duration: 500,
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

  // ===== VOTE SNACKBAR ==== //
  initSnackbarStream()
  const likeRatingConv = { 1: 3, 2: 4, 3: 5 }
  const dislikeRatingConv = { 1: 2, 2: 1 }
  const categoryRatingToMsg = {
    'popularity1': 'hated',
    'popularity2': 'disliked',
    'popularity3': 'liked &nbsp;♥️',
    'popularity4': 'really liked &nbsp;♥️',
    'popularity5': 'loved &nbsp;♥️',
    'intelligence1': 'rated this dumb',
    'intelligence2': 'rated this not smart',
    'intelligence3': 'rated this smart &nbsp;🧠',
    'intelligence4': 'rated this very smart &nbsp;🧠',
    'intelligence5': 'rated this genius &nbsp;🧠',
    'funny1': 'rated this not funny at all',
    'funny2': 'rated this not funny',
    'funny3': 'rated this funny &nbsp;😂',
    'funny4': 'rated this very funny &nbsp;😂',
    'funny5': 'rated this hilarious &nbsp;😂'
  }

  async function getLatestVoteData () {
    const voteParams = { account: 'yupyupyupyup', filter: '*:postvotev2', skip: '0', limit: 50, sort: 'desc' }
    const latestVote = await $.get('https://eos.hyperion.eosrio.io/v2/history/get_actions', voteParams)
    return latestVote.actions
  }

  const sleep = ms => new Promise(res => setTimeout(res, ms))

  async function initSnackbarStream () {
    const voteDataRows = await getLatestVoteData()
    for (let row of voteDataRows) {
      try {
        let { caption, voter, category, like, rating } = row.act.data
        let { username } = await $.get(`https://api.yup.io/accounts/${voter}`)
        let convertedRating = like ? likeRatingConv[rating] : dislikeRatingConv[rating]
        let ratingKey = `${category}${convertedRating}`
        let snackText = `${username} ${categoryRatingToMsg[ratingKey]} `
        let snackCaption = `${caption.slice(0,30)}...`
        let elem = `<div class="hideForPhablet" id="vote-snackbar">${snackText}<br>${snackCaption.replace(/(^\w+:|^)\/\//, '')}</div>`
        $('body').prepend(elem)
        $('#vote-snackbar').addClass('show')
        await sleep(3000)
        $('#vote-snackbar').removeClass('show')
        await sleep(Math.random() * 3000 + 2000)
      } catch (err) {
        console.log('ERROR IN SETTING SNACKBARS:', err);
      }
    }
  }
})


window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);
