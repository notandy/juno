const ENDPOINT = "https://endpoint-url-here.com"

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
        .filter((k) => options[k])
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
        .join("&")
    return `&${encodedOptions}`
}

// Check response status
const checkStatus = (response) => {
    if (response.status < 400) {
        return response
    } else {
        return response.json().then((message) => {
            var error = new HTTPError(message.code, message.message)
            return Promise.reject(error)
        }, (message) => {
            var error = new HTTPError(response.status, message || response.statusText)
            error.statusCode = response.status
            return Promise.reject(error)
        })
    }
}

export const updateAttributes = (target, source) => {
    const res = {};
    Object.keys(target)
        .forEach(k => res[k] = (source[k] ?? target[k]));
    return res
}

export const nextPageParam = (lastPage, pages) => {
    return new URLSearchParams(
        lastPage.links?.find(x => {return x.rel === 'next'})?.href
    ).get('marker')
}

export const fetchAll = ({queryKey, pageParam}) => {
    const [key, endpoint, options] = queryKey
    // Support for useInfiniteQuery
    const query = encodeUrlParamsFromObject({...options, marker: pageParam})
    return fetch(`${endpoint}/${key}?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then(checkStatus)
        .then((response) => {
            return response.json()
        })
}

export const fetchItem = ({queryKey}) => {
    const [key, id, endpoint, options] = queryKey
    const query = encodeUrlParamsFromObject(options)
    return fetch(`${endpoint}/${key}/${id}?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then(checkStatus)
        .then((response) => {
            return response.json()
        })
}

export const updateItem = ({key, id, endpoint, formState}) => {
    // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    const sendBody = JSON.stringify(formState)
    return fetch(`${endpoint}/${key}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: sendBody,
    })
        .then(checkStatus)
        .then((response) => {
            return response.json()
        })
}

export const deleteItem = (key, endpoint, id) => {
    return fetch(`${endpoint}/${key}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then(checkStatus)
}

export const createItem = (key, endpoint, formState) => {
    // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    const sendBody = JSON.stringify(formState)
    return fetch(`${endpoint}/${key}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: sendBody,
    })
        .then(checkStatus)
        .then((response) => {
            return response.json()
        })
}
