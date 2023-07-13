export const state = {
  ipfsGatewayUrl: "",
  unsplashApiKey: ""
}

export const setDataFromSCConfig = (options: any) => {
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
  if (options.unsplashApiKey) {
    setUnsplashApiKey(options.unsplashApiKey);
  }
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}

export const setUnsplashApiKey = (key: string) => {
  state.unsplashApiKey = key;
}

export const getUnsplashApiKey = () => {
  return state.unsplashApiKey;
}

export const getUnsplashPhotos = async (params: any = {}) => {
  if (!params.page) params.page = 1;
  if (!params.per_page) params.per_page = 18;
  params.client_id = getUnsplashApiKey();
  const queries = params ? new URLSearchParams({
    ...params
  }).toString() : '';
  try {
    const response = await fetch(`https://api.unsplash.com/photos?${queries}`);
    return await response.json();
  } catch {
    return null
  }
}

export const filterUnsplashPhotos = async (params: any = {}) => {
  if (!params.page) params.page = 1;
  if (!params.per_page) params.per_page = 18;
  if (!params.query) params.query = 'nature';
  params.client_id = getUnsplashApiKey();
  const queries = params ? new URLSearchParams({
    ...params
  }).toString() : '';
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?${queries}`);
    return await response.json();
  } catch {
    return null
  }
}
