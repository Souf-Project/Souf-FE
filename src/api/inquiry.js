import client from "./client";
import axios from "axios";

export const postInquiry = async (requestBody) => {
    try {
        const response = await client.post("/api/v1/inquiry", requestBody);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("문의 생성 에러:", error);
        throw error;
    }
};

export const uploadInquiryFile = async (file) => {
    try {
        const response = await client.post(`/api/v1/inquiry/upload`, file);
        return response.data;
    } catch (error) {
        console.error("문의 파일 업로드 에러:", error);
        throw error;
    }
};


export async function getInquiryList(pageable) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await client.get("/api/v1/inquiry/my", {
      params: pageable,
    });
    return response;
  }
  
  export async function deleteInquiry(inquiryId) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await client.delete(`/api/v1/inquiry/${inquiryId}`);
    return response;
  }
  
  export async function patchInquiry(inquiryId, requestBody) {
    const accessToken = localStorage.getItem("accessToken");
    const response = await client.patch(`/api/v1/inquiry/${inquiryId}`, requestBody);
    return response;
  }

