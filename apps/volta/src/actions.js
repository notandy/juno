const ENDPOINT = "https://volta.qa-de-1.cloud.sap/api/v1"

class HTTPError extends Error {
  constructor(code, message) {
    super(message || code)
    this.name = "HTTPError"
    this.statusCode = code
  }
}

const encodeUrlParamsFromObject = (options) => {
  if (!options) return ""
  let encodedOptions = Object.keys(options)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
    .join("&")
  return `&${encodedOptions}`
}

const checkStatus = (response) => {
  if (response.status < 400) {
    return response
  } else {
    return response.text().then((message) => {
      var error = new Error(message || response.statusText || response.status)
      error.statusCode = response.status
      throw error
    })
  }
}

// https://volta.qa-de-1.cloud.sap/api/v1/${ca}/certificate
export const certificates = ({ queryKey }) => {
  const [_key, bearerToken] = queryKey
  return fetch(`${ENDPOINT}/galvani-pki/certificate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  })
    .then(checkStatus)
    .then((response) => {
      // sort entries by expiration date
      return response.json().then((jsonResp) => {
        return jsonResp
          .sort(
            (a, b) =>
              new Date(a?.not_after).getTime() -
              new Date(b?.not_after).getTime()
          )
          .reverse()
      })
    })
}

export const createCertificate = (bearerToken, formState) => {
  const sendBody = JSON.stringify(formState)
  return fetch(`${ENDPOINT}/galvani-pki/certificate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: sendBody,
  })
    .then(checkStatus)
    .then((response) => {
      return response.json()
    })
}

export const revokeCertificate = (bearerToken, serial) => {
  return fetch(`${ENDPOINT}/galvani-pki/certificate/${serial}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  }).then(checkStatus)
}
