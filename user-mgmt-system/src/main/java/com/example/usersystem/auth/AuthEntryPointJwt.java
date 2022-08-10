package com.example.usersystem.auth;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.example.usersystem.service.RefreshTokenService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

  private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
  @Autowired
  private JwtUtils jwtUtils;
  @Autowired
  RefreshTokenService refreshTokenService;

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
      throws IOException, ServletException {

    final Map<String, Object> body = new HashMap<>();
    
    logger.error("Unauthorized error: {}", authException.getMessage());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    String jwt = jwtUtils.parseJwt(request);

    if(jwt != null){
        try{
            Jwts.parser().setSigningKey(jwtUtils.getJwtSecret()).parseClaimsJws(jwt);
            
        } catch (ExpiredJwtException e) {
            String refreshToken = request.getHeader("Authorization");
            refreshToken = refreshToken.substring(refreshToken.indexOf("REFRESH_TOKEN") + "REFRESH_TOKEN".length(), refreshToken.length());

            boolean refreshTokenValid = refreshTokenService.verifyExpiration(refreshToken);

            if(refreshTokenValid){
                String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
                String newToken = jwtUtils.generateTokenFromUsername(username);
                String newRefreshToken = refreshTokenService.generateRefreshToken(username);

                body.put("token", newToken);
                body.put("refreshToken", newRefreshToken);

            }

        }catch(Exception e){
            // String a ="";
        }
    }

    body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
    body.put("error", "Unauthorized");
    body.put("message", authException.getMessage());
    body.put("path", request.getServletPath());

    final ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(response.getOutputStream(), body);

//    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
  }

}