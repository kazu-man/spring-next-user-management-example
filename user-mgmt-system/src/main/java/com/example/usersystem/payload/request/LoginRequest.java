package com.example.usersystem.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import javax.validation.constraints.Email;

import lombok.Data;

@Data
public class LoginRequest {

	@NotBlank
	@Size(max = 50)
	@Email  
  	private String email;

	@NotBlank
	private String password;

}