package com.example.usersystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.usersystem.auth.AuthEntryPointJwt;
import com.example.usersystem.auth.JwtTokenConfigurer;

//Spring Security 5.7.1 or newer, or Spring Boot 2.7.0 or newer,
@Configuration
public class LatestSecurityConfiguration {

    @Autowired
    private UserDetailsService customUserDetailsService;
    @Autowired
    JwtTokenConfigurer JwtTokenConfigurer;
    @Autowired
	private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }
 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
     
        http
        .csrf()
        .disable()
        .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
        .authorizeHttpRequests()
        .antMatchers("/api/v1/getusers")
        .hasAuthority("USER")
        .antMatchers("/api/v1/hello")
        .hasAuthority("USER")
        .antMatchers("/api/auth/**").permitAll()
        // .antMatchers("/**")
        // .permitAll()
        .anyRequest()
        .authenticated()
        .and()
        // .formLogin()
        //     .and()
        .cors()
            .configurationSource(this.corsConfigurationSource())
        .and()
        .logout()
        .logoutSuccessUrl("http://localhost:3000");
        http.apply(JwtTokenConfigurer);
 
        return http.build();
    }

    // CORS???????????????Bean??????
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var configuration = new CorsConfiguration();

        // ???CORS???????????????URL?????????(Access-Control-Allow-Origin) 
        configuration.addAllowedOrigin("http://localhost:3000/");
        
        // ???????????????Header?????????(Access-Control-Allow-Headers)
        configuration.addAllowedHeader("*");
        
        // ???????????????Method?????????(Access-Control-AllowMethods)
        configuration.addAllowedMethod("*");
        
        // ????????????????????????????????????(Access-Control-Allow-Credentials)
        configuration.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();

        // COSR??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }

     
    // @Bean
    // public BCryptPasswordEncoder passwordEncoder() {
    //     return new BCryptPasswordEncoder();
    // }

    // @Bean
    // public WebSecurityCustomizer webSecurityCustomizer() {
    //     return (web) -> web.ignoring().antMatchers("/images/**", "/js/**", "/webjars/**");
    // }
    
}
