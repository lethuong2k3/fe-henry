export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
}

export interface InfoResponse {
  id: string;
  email: string;
  name: string;   
}
