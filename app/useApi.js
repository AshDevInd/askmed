// useApi.js

import useSWR from 'swr';
import { apiRequest } from './Api';

// Define a custom fetcher function for SWR
const fetcher = (url, data) => apiRequest(url, data);

export const getDataList = (url, data) => {
  const { data: responseData, error, isLoading } = useSWR(
    url ? [url, data] : null,  // Only run if `url` is available
    fetcher
  );

  return {
    data: responseData,
    error,
    isLoading,
  };
};
