import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function disstCategoryGroup () {
  const url = `${BASE_URL}/disst/disstcategorygroup`
  return axios.post(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function dissList (categoryId = 10000000, sortId = 5) {
  const url = `${BASE_URL}/disst/disstlist`
  const data = {
    categoryId,
    sortId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function disstDetailSongList (disstId) {
  const url = `${BASE_URL}/disst/disstsonglist`
  const data = {
    disstId: disstId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function disstDetail (disstId) {
  const url = `${BASE_URL}/disst/disstDetail`
  const data = {
    disstId: disstId
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
