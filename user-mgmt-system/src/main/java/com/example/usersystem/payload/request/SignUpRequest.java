package com.example.usersystem.payload.request;

import javax.validation.constraints.*;

import lombok.Data;

@Data
public class SignUpRequest {

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  private String role;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;
} 