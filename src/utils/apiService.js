import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../constants/api';
import {
  addPendingChange,
  clearPendingChanges,
  getPendingChanges,
} from './offlineStorage';

let networkSubscription = null;
let processingPending = false;

const isOnlineState = (state) =>
  Boolean(state?.isConnected && state?.isInternetReachable !== false);

const buildHeaders = (token) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  return headers;
};

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const rawMessage = data?.msg || data?.message || data?.error;
    const message =
      typeof rawMessage === 'string'
        ? rawMessage
        : rawMessage
          ? JSON.stringify(rawMessage)
          : `Request failed with status ${response.status}`;
    const error = new Error(response.status === 401 ? 'Session expired' : message);
    error.status = response.status;
    throw error;
  }

  return data;
};

const queueRequest = async ({ endpoint, method, data, token }) => {
  await addPendingChange({
    endpoint,
    method,
    data,
    token,
    createdAt: new Date().toISOString(),
  });

  return { queued: true };
};

export const makeApiRequest = async ({
  endpoint,
  method = 'GET',
  data,
  token,
  isCritical = false,
}) => {
  const networkState = await NetInfo.fetch();
  const online = isOnlineState(networkState);

  if (!online) {
    if (isCritical) {
      throw new Error('No internet connection');
    }

    return queueRequest({ endpoint, method, data, token });
  }

  try {
    const options = {
      method,
      headers: buildHeaders(token),
    };

    if (data !== undefined && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return parseResponse(response);
  } catch (error) {
    if (isCritical || error.status === 401) {
      throw error;
    }

    return queueRequest({ endpoint, method, data, token });
  }
};

export const processPendingRequests = async () => {
  if (processingPending) {
    return;
  }

  processingPending = true;

  try {
    const networkState = await NetInfo.fetch();
    if (!isOnlineState(networkState)) {
      return;
    }

    const pendingChanges = await getPendingChanges();
    if (!pendingChanges.length) {
      return;
    }

    for (const change of pendingChanges) {
      await makeApiRequest({
        endpoint: change.endpoint,
        method: change.method,
        data: change.data,
        token: change.token,
        isCritical: true,
      });
    }

    await clearPendingChanges();
  } catch (error) {
    console.error('Failed to process pending requests:', error.message);
  } finally {
    processingPending = false;
  }
};

export const setupNetworkListener = () => {
  if (networkSubscription) {
    return;
  }

  networkSubscription = NetInfo.addEventListener((state) => {
    if (isOnlineState(state)) {
      processPendingRequests();
    }
  });
};

export const cleanupNetworkListener = () => {
  if (networkSubscription) {
    networkSubscription();
    networkSubscription = null;
  }
};
