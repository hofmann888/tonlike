// 'use server' // TODO?: UserProvider fetches as a client and check as a server

async function fetchRequest(uri: string, params?: RequestInit) {
  let result;

  console.log('fetchRequest:', uri);

  // console.log('siteurl', process.env.NEXT_PUBLIC_SITE_URL);

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${uri}`, params)
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
  console.log('authRequest');
  try {
    return await fetchRequest('/auth', {
      method: 'POST',
      headers: { Authorization: `${initDataRaw}` },
    });
  } catch (error) {
    console.log('authRequest error', error);
    throw new Error('Request error');
  }
}

export async function tgCheckMembershipRequest(tgId: number, channel: string) { // TODO: try catch?
  try {
    return await fetchRequest('/api/tg/check-membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tgId: tgId, channel: channel})
    });
  } catch (error) {
    console.log('tgCheckMembershipRequest error', error);
    throw new Error('Request error');
  }
}

export async function tgCheckBoostRequest(tgId: number, channel: string) {
  try {
    return await fetchRequest('/api/tg/check-boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tgId: tgId, channel: channel})
    });
  } catch (error) {
    console.log('tgCheckBoostRequest error', error);
    throw new Error('Request error');
  }
}

export async function tgSetWebhookRequest() {
  try {
    return await fetchRequest('/api/tg/set-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('tgSetWebhookRequest error', error);
    throw new Error('Request error');
  }
}