import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getLyric (mid) {
  const url = `${BASE_URL}/song/getLyric`
  const data = {
    songmid: mid
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongPurl (mid) {
  const url = `${BASE_URL}/song/getsongpurl`
  const data = {
    songmid: mid
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function songDetail (songId, songMid) {
  const url = `${BASE_URL}/song/songdetail`
  const data = {
    songId,
    songMid
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function songDetailLyric (songId) {
  const url = `${BASE_URL}/song/songdetaillyric`
  const data = {
    songId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function downloadSong (downloadUrl) {
  return axios({
    method: 'get',
    url: downloadUrl,
    responseType: 'blob'
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
