package com.example.usersystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.usersystem.auth.JwtTokenConfigurer;


// @Configuration
// @EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService customUserDetailsService;
    @Autowired
    JwtTokenConfigurer JwtTokenConfigurer;

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception{
        http
        .csrf()
        .disable()
        .authorizeHttpRequests()
        .antMatchers("/api/v1/getusers")
        .hasAuthority("USER")
        .antMatchers("/api/v1/hello")
        .hasAuthority("USER")
        .antMatchers("/api/auth/**").permitAll()
        .antMatchers("/**")
        .permitAll()
        .anyRequest()
        .authenticated()
        .and()
        // .formLogin()
        //     .and()
        .cors()
            .configurationSource(this.corsConfigurationSource());
        http.apply(JwtTokenConfigurer);



        // .and()//ここからが問題の部分
        // .csrf()
        // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        // .and()
        // .exceptionHandling()
        // .accessDeniedPage("/access-denied.html");


    }

    // CORS設定を行うBean定義
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var configuration = new CorsConfiguration();

        // ①CORSを許可するURLの登録(Access-Control-Allow-Origin) 
        configuration.addAllowedOrigin("http://localhost:3000/");
        
        // ②許可するHeaderの登録(Access-Control-Allow-Headers)
        configuration.addAllowedHeader("*");
        
        // ③許可するMethodの登録(Access-Control-AllowMethods)
        configuration.addAllowedMethod("*");
        
        // ④認証情報送信許可の登録(Access-Control-Allow-Credentials)
        configuration.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();

      // COSR設定を行う範囲のパスを指定する。この例では全てのパスに対して設定が有効になる
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
      return super.authenticationManagerBean();
    }


}