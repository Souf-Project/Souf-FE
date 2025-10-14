import client from "./client";
import axios from "axios";

export const postInquiry = async (requestBody) => {
    try {
        const response = await client.post("/api/v1/inquiry", requestBody);
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

export const patchInquiry = async (inquiryId) => {
    try {
        const response = await client.patch(`/api/v1/inquiry/${inquiryId}`);
        return response.data;
    } catch (error) {
        console.error("문의 수정 에러:", error);
        throw error;
    }
};

export const deleteInquiry = async (inquiryId) => {
    try {
        const response = await client.delete(`/api/v1/inquiry/${inquiryId}`);
        return response.data;
    } catch (error) {
        console.error("문의 삭제 에러:", error);
        throw error;
    }
};