package com.example.usersystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.usersystem.auth.JwtUtils;
import com.example.usersystem.repository.UserRepository;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.Jwts;
import java.util.Date;



@Service
public class RefreshTokenService {
  @Value("${bezkoder.app.jwtRefreshExpirationMs}")
  private Long refreshTokenDurationMs;

  @Autowired
  private JwtUtils jwtUtils;

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + refreshTokenDurationMs))
                .signWith(SignatureAlgorithm.HS512, jwtUtils.getJwtSecret())
                .compact();
    }

  public boolean verifyExpiration(String token) {

    boolean result = true;
    try{
        Jwts.parser().setSigningKey(jwtUtils.getJwtSecret()).parseClaimsJws(token);

    }catch(Exception e){
        result = false;
    }

    return result;
  }

}