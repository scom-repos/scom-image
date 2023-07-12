export const state = {
  ipfsGatewayUrl: ""
}

export const setDataFromSCConfig = (options: any) => {
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}

export const getUnsplashPhotos = async (params: any = {}) => {
  if (params.count) params.count = 18;
  params.client_id = 'ylMtikqlCAZdDIxGz-SV15TOfqzf03epdOoE_5hBBUo';
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
