const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-c911d-firebase-adminsdk-48xal-17390dfbfd.json')
const databaseURL = 'https://fcm-c911d.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-c911d/messages:send'
const deviceToken =
  'fn561-FX03RPmXjIQhRdfE:APA91bExs6nOD7r2sH25BBwe_n2BsSBqP_DAxPARjDS1CICjjJBiDwji8CeYYZVWHKPAeGSdMhff2hCMEq7NutCHX11pbi2wH9tIzA-JXS6adEBhg3XmJw_2rTck7jnnUsifNgAtx5Bz'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: '610112418050',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()