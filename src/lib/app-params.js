const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const getAppParams = () => {
  // Clean up any old auth tokens if they exist
  if (storage.getItem('token')) {
    storage.removeItem('token');
  }
  
  return {
    // Add any app-specific parameters here
  };
};

export const appParams = {
  ...getAppParams()
};
