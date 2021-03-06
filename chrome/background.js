if (typeof browser !== 'undefined') {
  chrome = browser
}

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (details.initiator.startsWith('chrome-extension://')) {
    details.requestHeaders.forEach(detail => {
      if (detail.name === 'User-Agent') {
        detail.value = 'netdisk;2.2.51.6;netdisk;10.0.63;PC;android-android'
      }
    })
  }
  return { requestHeaders: details.requestHeaders }
}, { urls: ['*://pcs.baidu.com/rest/2.0/pcs/file*'], tabId: chrome.tabs.TAB_ID_NONE }, ['blocking', 'requestHeaders'])

const httpSend = ({ url, options }, resolve, reject) => {
  fetch(url, options).then((response) => {
    if (response.ok) {
      response.text().then((data) => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch {
          resolve(data)
        }
      })
    } else {
      reject(response)
    }
  }).catch((err) => {
    reject(err)
  })
}
// https://developer.chrome.com/apps/runtime#event-onMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.method) {
    case 'addScript':
      chrome.tabs.executeScript(sender.tab.id, { file: request.data })
      break
    case 'rpcData':
      httpSend(request.data, (data) => {
        sendResponse(true)
      }, (err) => {
        console.log(err)
        sendResponse(false)
      })
      return true
    case 'configData':
      for (const key in request.data) {
        localStorage.setItem(key, request.data[key])
      }
      break
    case 'rpcVersion':
      httpSend(request.data, (data) => {
        sendResponse(data.result.version)
      }, (err) => {
        console.log(err)
        sendResponse(false)
      })
      return true
    case 'fetch':
      httpSend(request.data, (data) => {
        sendResponse(data)
      }, (err) => {
        console.log(err)
        sendResponse(err)
      })
      return true
    case 'getCookies':
      getCookies(request.data).then(value => sendResponse(value))
      return true
  }
})

// Promise style `chrome.cookies.get()`
const getCookie = (detail) => {
  return new Promise(function (resolve) {
    chrome.cookies.get(detail, resolve)
  })
}

const getCookies = (details) => {
  return new Promise(function (resolve) {
    const list = details.map(item => getCookie(item))
    Promise.all(list).then(function (cookies) {
      const obj = {}
      for (const item of cookies) {
        if (item !== null) {
          obj[item.name] = item.value
        }
      }
      resolve(obj)
    })
  })
}

const showNotification = (id, opt) => {
  if (!chrome.notifications) {
    return
  }
  chrome.notifications.create(id, opt, () => {})
  setTimeout(() => {
    chrome.notifications.clear(id, () => {})
  }, 5000)
}
// ????????????????????????
const manifest = chrome.runtime.getManifest()
const previousVersion = localStorage.getItem('version')
if (previousVersion === '' || previousVersion !== manifest.version) {
  var opt = {
    type: 'basic',
    title: '??????',
    message: '???????????????????????????' + manifest.version + '????????????\n????????????????????????AppId??????~',
    iconUrl: 'img/icon.jpg'
  }
  const id = new Date().getTime().toString()
  showNotification(id, opt)
  localStorage.setItem('version', manifest.version)
}
