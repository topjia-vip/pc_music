import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function topListInfo () {
  const url = `${BASE_URL}/rank/toplistinfo`
  return axios.post(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function initTopDetail (topId, period) {
  const url = `${BASE_URL}/rank/topdetail`
  const data = {
    topId,
    period
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
