import client from "./client";


export async function getClubList(pageable) {
    const response = await client.get(`/api/v1/clubs`, {
      params: pageable,
    });
    return response;
  }
  
  export async function postClubMemberJoin(clubId) {
    const response = await client.post(`/api/v1/clubs/${clubId}/join`);
    return response;
  }
  
  export async function getMyClubList(pageable) {
    const response = await client.get("/api/v1/clubs/my", {
      params: pageable,
    });
    return response;
  }
  
  export async function getClubMemberList(clubId, pageable) {
    const response = await client.get(`/api/v1/clubs/${clubId}/members`, {
      params: pageable,
    });
    return response;
  }
  
  export async function getClubJoinPendingList(clubId, pageable) {
    const response = await client.get(`/api/v1/clubs/${clubId}/pending`, {
      params: pageable,
    });
    return response;
  }
  
  export async function patchClubMemberJoinDecision(clubId, studentId, decision) {
    const response = await client.patch(`/api/v1/clubs/${clubId}/members/${studentId}`, null, {
      params: {
        decision: decision,
      },
    });
    return response;
  }
  
  export async function deleteClubWithdraw(clubId) {
    const response = await client.delete(`/api/v1/clubs/${clubId}/withdraw`);
    return response;
  }