package com.sonidovivo.inventario.exception;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String mensaje){
        super(mensaje);
    }
}
