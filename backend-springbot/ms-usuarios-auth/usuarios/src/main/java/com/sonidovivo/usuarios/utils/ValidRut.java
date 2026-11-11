package com.sonidovivo.usuarios.utils;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RutValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRut {
    String message() default "El RUT chileno no es válido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
