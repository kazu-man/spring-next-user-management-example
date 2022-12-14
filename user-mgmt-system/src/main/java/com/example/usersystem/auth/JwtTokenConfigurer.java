package com.example.usersystem.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenConfigurer extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

	@Autowired
	AuthTokenFilter authTokenFilter;
	@Override
	public void configure(HttpSecurity http) throws Exception {
		http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
	}
}