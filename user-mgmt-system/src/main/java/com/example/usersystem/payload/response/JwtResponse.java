package com.example.usersystem.payload.response;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private String username;
  private List<String> roles;
  private String error;
  private String refreshToken;

  public JwtResponse(String accessToken, String username, List<String> roles,String refreshToken) {
    this.token = accessToken;
    this.username = username;
    this.roles = roles;
    this.refreshToken = refreshToken;
  }
}