const DEFAULT_STREAM_ENDPOINT = '/ai/chatstream'
const DEFAULT_IMAGE_URL_ENDPOINT = '/ai/url'
const DEFAULT_TEXT_TO_VIDEO_ENDPOINT = '/ai/texttovide'
const DEFAULT_IMAGE_TO_VIDEO_ENDPOINT = '/ai/imagetovide'
const DEFAULT_VIDEO_EFFECT_ENDPOINT = '/ai/videoeffect'

export function getChatStreamUrl(message) {
  const endpoint = process.env.VUE_APP_AI_STREAM_ENDPOINT || DEFAULT_STREAM_ENDPOINT
  return `${endpoint}?message=${encodeURIComponent(message)}`
}

export function fetchChatStream(message, signal) {
  const headers = {
    'Accept': 'text/html;charset=UTF-8',
    'Cache-Control': 'no-cache'
  }

  return fetch(getChatStreamUrl(message), {
    method: 'GET',
    headers,
    signal
  })
}

function fetchJson(url, signal) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    },
    signal
  }).then(async res => {
    if (!res.ok) {
      throw new Error(`HTTP错误: ${res.status}`)
    }
    return res.json()
  })
}

function fetchText(url, signal) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/plain',
      'Cache-Control': 'no-cache'
    },
    signal
  }).then(async res => {
    if (!res.ok) {
      throw new Error(`HTTP错误: ${res.status}`)
    }
    return res.text()
  })
}

export function getImageUrl(message, signal) {
  const endpoint = process.env.VUE_APP_AI_IMAGE_URL_ENDPOINT || DEFAULT_IMAGE_URL_ENDPOINT
  const url = `${endpoint}?message=${encodeURIComponent(message)}`
  return fetchJson(url, signal)
}

export function textToVideo(message, signal) {
  const endpoint = process.env.VUE_APP_AI_TEXT_TO_VIDEO_ENDPOINT || DEFAULT_TEXT_TO_VIDEO_ENDPOINT
  const url = `${endpoint}?message=${encodeURIComponent(message)}`
  return fetchText(url, signal)
}

export function imageToVideo(message, signal) {
  const endpoint = process.env.VUE_APP_AI_IMAGE_TO_VIDEO_ENDPOINT || DEFAULT_IMAGE_TO_VIDEO_ENDPOINT
  const url = `${endpoint}?message=${encodeURIComponent(message || '')}`
  return fetchText(url, signal)
}

export function videoEffect(signal) {
  const endpoint = process.env.VUE_APP_AI_VIDEO_EFFECT_ENDPOINT || DEFAULT_VIDEO_EFFECT_ENDPOINT
  return fetchText(endpoint, signal)
}
