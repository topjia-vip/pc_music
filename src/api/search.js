import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function smartSearch (key) {
  const url = `${BASE_URL}/search/smartsearch`
  const data = {
    key
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getHotKey () {
  const url = `${BASE_URL}/getHotKey`
  return axios.post(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function search (key, num, page, type) {
  let url = ''
  if (type === 'song') {
    url = `${BASE_URL}/search/searchsong`
  } else if (type === 'album') {
    url = `${BASE_URL}/search/searchalbum`
  } else if (type === 'playlist') {
    url = `${BASE_URL}/search/searchsonglist`
  } else {
    url = `${BASE_URL}/search/searchlyric`
  }
  const data = {
    key,
    num,
    page
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
