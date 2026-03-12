const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }
  
  return {response, data}
}

export {apiFetch}