package com.example.usersystem.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex, HttpHeaders headers,
      HttpStatus status, WebRequest request) {

    Map<String, Map<String,String>> body = new HashMap<>();
    Map<String,String> map = new HashMap<>();

    ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .forEach(e -> {
            if(map.containsKey(e.getField())){
                String existMsg = map.get(e.getField());
                map.put(e.getField(), existMsg + "\n" + e.getDefaultMessage());                
            }else{
                map.put(e.getField(), e.getDefaultMessage());
            }
         });

    body.put("errors", map);

    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }
}