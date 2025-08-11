import axios from "axios";
import client from "./client";

export const patchLike = async (feedId, requestBody) => {
    try {
      const response = await client.patch(`/api/v1/feed/${feedId}/like`, requestBody);
      return response.data;
    } catch (error) {
      console.error("좋아요 생성/삭제 에러:", error);
      throw error;
    }
  };
  
export const getComment = async (postId) => {
    try {
      const response = await client.get(`/api/v1/post/${postId}/comment`, {
       
      });
      return response.data;
    } catch (error) {
      console.error("댓글 조회 에러:", error);
      throw error;
    }
  };

  export const postComment = async (postId, requestBody) => {
    try {
      const response = await client.post(`/api/v1/post/${postId}/comment`, requestBody);
      return response.data;
    } catch (error) {
      console.error("댓글 생성 에러:", error);
      throw error;
    }
  };

  export const deleteComment = async (postId, commentId) => {
    try {
      const response = await client.delete(`/api/v1/post/${postId}/comment/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("댓글 삭제 에러:", error);
      throw error;
    }
  };

  // export const patchComment = async (postId) => {
  //   try {
  //     const response = await client.patch(`/api/v1/post/${postId}/comment`, {
       
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("댓글 수정 에러:", error);
  //     throw error;
  //   }
  // };

  // 대댓글 작성
  export const postAdditionalComment = async (postId, requestBody) => {
    try {
      const response = await client.post(`/api/v1/post/${postId}/comment/reply`, requestBody);
      return response.data;
    } catch (error) {
      console.error("대댓글 생성 에러:", error);
      throw error;
    }
  };

  // 대댓글 조회
  export const getAdditionalComment = async (postId, commentId, pageable) => {
    try {
      const response = await client.get(`/api/v1/post/${postId}/comment/${commentId}/reply`, {
        params: {
          page: pageable.page,
          size: pageable.size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("대댓글 조회 에러:", error);
      throw error;
    }
  };