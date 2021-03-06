import EventEmitter from './EventEmitter'

class Store extends EventEmitter {
  constructor () {
    super()
    this.defaultRPC = [{ name: 'ARIA2 RPC', url: 'http://localhost:6800/jsonrpc' }]
    this.defaultUserAgent = 'netdisk;2.2.51.6;netdisk;10.0.63;PC;android-android'
    this.defaultReferer = 'https://pan.baidu.com/disk/home'
    this.defaultAppId = 250528
    this.defaultConfigData = {
      rpcList: this.defaultRPC,
      configSync: false,
      md5Check: false,
      svip: false,
      fold: 0,
      interval: 300,
      downloadPath: '',
      userAgent: this.defaultUserAgent,
      referer: this.defaultReferer,
      appId: this.defaultAppId,
      headers: ''
    }
    this.configData = {}
    this.on('initConfigData', this.init.bind(this))
    this.on('setConfigData', this.set.bind(this))
    this.on('clearConfigData', this.clear.bind(this))
  }

  init () {
    chrome.storage.sync.get(null, (items) => {
      for (const key in items) {
        chrome.storage.local.set({ key: items[key] }, () => {
          console.log('chrome first local set: %s, %s', key, items[key])
        })
      }
    })
    chrome.storage.local.get(null, (items) => {
      this.configData = Object.assign({}, this.defaultConfigData, items)
      this.trigger('updateView', this.configData)
    })
  }

  getConfigData (key = null) {
    if (key) {
      return this.configData[key]
    } else {
      return this.configData
    }
  }

  set (configData) {
    this.configData = configData
    this.save(configData)
    this.trigger('updateView', configData)
  }

  save (configData) {
    for (const key in configData) {
      chrome.storage.local.set({ [key]: configData[key] }, () => {
        console.log('chrome local set: %s, %s', key, configData[key])
      })
      if (configData.configSync === true) {
        chrome.storage.sync.set({ [key]: configData[key] }, () => {
          console.log('chrome sync set: %s, %s', key, configData[key])
        })
      }
    }
  }

  clear () {
    chrome.storage.sync.clear()
    chrome.storage.local.clear()
    this.configData = this.defaultConfigData
    this.trigger('updateView', this.configData)
  }
}

export default new Store()
