import client from "./client";

export const getOrdererInfo = async (roomId) => {
  const response = await client.get(`/api/v1/contract/${roomId}/orderer/preview`);
  return response.data;
};

export const getBeneficiaryInfo = async (roomId) => {
  const response = await client.get(`/api/v1/contract/${roomId}/beneficiary/preview`);
  return response.data;
};

export const postContractOrderer = async (roomId, requestBody) => {
    const response = await client.post(`/api/v1/contract/${roomId}/orderer`, requestBody);
    return response.data;
};

export const postContractBeneficiary = async (roomId, requestBody) => {
  const response = await client.post(`/api/v1/contract/${roomId}/beneficiary`, requestBody);
  return response.data;
};

export const patchContract = async (roomId, requestBody) => {
  const response = await client.patch(`/api/v1/contract/${roomId}/beneficiary/preview/contract`, requestBody);
  return response.data;
};