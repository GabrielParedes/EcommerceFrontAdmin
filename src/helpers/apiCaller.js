import axios from "axios"


// const url = "http://127.0.0.1:5000/api"
const url = "http://gabrielparedes2000.pythonanywhere.com/api"

const getDataById = async (endpoint, id) => {
  let response

  if (endpoint) {
    await axios.get(`${url}/${endpoint}/${id}`)
      .then(resp => {
        response = resp.data
      })
      .catch(err => {
        throw err
      })

  }

  return response
}

const getData = async (endpoint) => {
  let response

  if (endpoint) {
    await axios.get(`${url}/${endpoint}`)
      .then(resp => {
        response = resp.data
      })
      .catch(err => {
        throw err
      })

  }

  return response
}

const postData = async (endpoint, data) => {
  let response

  if (endpoint) {
    await axios.post(`${url}/${endpoint}`, data)
      .then(resp => {
        console.log(resp.data)

        response = resp.data
      })
      .catch(err => {
        throw err
      })
  }

  return response
}

const postImage = async (image) => {
  let response

  if (image) {
    await axios.post(`${url}/upload`, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(resp => {
        console.log(resp.data)

        response = resp.data
      })
      .catch(err => {
        throw err
      })
  }

  return response
}

const putDataById = async (endpoint, id, data) => {
  let response

  if (endpoint) {
    await axios.put(`${url}/${endpoint}/${id}`, data)
      .then(resp => {
        console.log(resp.data)

        response = resp.data
      })
      .catch(err => {
        throw err
      })
  }

  return response
}

const deleteDataById = async (endpoint, id) => {
  let response


  if (endpoint) {
    await axios.delete(`${url}/${endpoint}/${id}`)
      .then(resp => {
        response = resp.data
      })
      .catch(err => {
        throw err
      })

  }

  return response
}

export {
  getDataById,
  getData,
  postData,
  postImage,
  putDataById,
  deleteDataById
}