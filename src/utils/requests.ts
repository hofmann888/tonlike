async function fetchRequest(uri: string, params?: RequestInit) {
  let result;

  console.log('fetchRequest:', uri);

  await fetch(uri, params)
  .then(response => {
    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log("Fetched data:", data);
    result = data;
  })
  .catch(error => {
    throw new Error(`Request error: ${error}`);
  });

  return result;
}

export async function authRequest(initDataRaw?: string) {
  return await fetchRequest('/auth', {
    method: 'POST',
    headers: { Authorization: `${initDataRaw}` },
  });
}

export async function tgCheckMembershipRequest(tgId: number, channel: string) {
  return await fetchRequest('/api/tg/check-membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tgId: tgId, channel: channel})
  });
}