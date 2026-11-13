package com.sonidovivo.usuarios.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sonidovivo.usuarios.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(ResourceNotFoundException ex) {
        return construirRespuesta(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> manejarCredencialesInvalidas(BadCredentialsException ex) {
        return construirRespuesta(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return construirRespuesta(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> erroresCampos = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            erroresCampos.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return construirRespuesta(HttpStatus.BAD_REQUEST, "Error de validación en los datos enviados", erroresCampos);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        return construirRespuesta(HttpStatus.BAD_REQUEST, "Formato JSON inválido o valor de rol no permitido", null);
    }

    private ResponseEntity<ErrorResponse> construirRespuesta(
            HttpStatus status,
            String message,
            Map<String, String> errors) {
        ErrorResponse body = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .errors(errors)
                .build();
        return ResponseEntity.status(status).body(body);
    }

}
