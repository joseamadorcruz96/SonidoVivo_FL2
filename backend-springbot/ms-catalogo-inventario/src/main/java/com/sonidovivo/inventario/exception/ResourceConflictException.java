package com.sonidovivo.inventario.exception;

public class ResourceConflictException extends RuntimeException{
    public ResourceConflictException(String mensaje){
        super(mensaje);
    }
}
