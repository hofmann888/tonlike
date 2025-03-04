async function fetchRequest(uri: string, params?: RequestInit) {
  let result;

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${uri}`, params)
    .then(response => {
      if (!response.ok) {
        throw new Error('Response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched Data:', data);
      result = data;
    })
    .catch(error => {
      throw new Error(`Request Error: ${error}`);
    })
  ;

  return result;
}

export async function authRequest(initDataRaw?: string) {
  try { // TODO?: remove try...catch?
    return await fetchRequest('/auth', {
      method: 'POST',
      headers: { Authorization: `${initDataRaw}` },
    });
  } catch (error) {
    console.log('authRequest Error:', error);
    throw new Error('Request Error.');
  }
}