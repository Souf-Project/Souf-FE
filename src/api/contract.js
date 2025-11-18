import client from "./client";

export const getOrdererInfo = async (roomId) => {
  const response = await client.get(`/api/v1/contract/${roomId}/orderer/preview`);
  return response.data;
};

export const postContractOrderer = async (roomId, requestBody) => {
    const response = await client.post(`/api/v1/contract/${roomId}/orderer`, requestBody);
    return response.data;
};