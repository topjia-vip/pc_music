import { BASE_URL } from './config'
import axios from 'axios'
import Qs from 'qs'

export function getSingerList (area, genre, index, sex, sin, cur_page = 1) {
  const url = `${BASE_URL}/singer/getSingerList`
  const data = {
    area,
    genre,
    index,
    sex,
    sin,
    cur_page
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerMid) {
  const url = `${BASE_URL}/singer/singerdetail`
  const data = {
    singerMid
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
