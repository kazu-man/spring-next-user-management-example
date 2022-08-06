package com.example.usersystem.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.usersystem.auth.JwtUtils;
import com.example.usersystem.entity.CustomUserDetail;
import com.example.usersystem.entity.UserEntity;
import com.example.usersystem.payload.request.LoginRequest;
import com.example.usersystem.payload.request.SignUpRequest;
import com.example.usersystem.payload.response.JwtResponse;
import com.example.usersystem.payload.response.MessageResponse;
import com.example.usersystem.repository.UserRepository;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	JwtUtils jwtUtils;
	@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder encoder;

	@PostMapping("/signin")
	public JwtResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = null;
        try{
            
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            }catch(Exception e){
                System.out.println(e.getMessage());
				JwtResponse jwtResponse = new JwtResponse();
				jwtResponse.setError(e.getMessage());
				return jwtResponse;
            }
			
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);
			
			CustomUserDetail userDetails = (CustomUserDetail) authentication.getPrincipal();		
			List<String> roles = userDetails.getAuthorities().stream()
			.map(item -> item.getAuthority())
			.collect(Collectors.toList());
            JwtResponse jwtResponse = new JwtResponse(jwt, 
            userDetails.getUsername(), 
            roles);
            return jwtResponse;
	}



	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}
		// Create new user's account
		UserEntity user = new UserEntity(signUpRequest.getUsername(), 
							 signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()),
							 signUpRequest.getRole()
							 );
		
		userRepository.save(user);
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}