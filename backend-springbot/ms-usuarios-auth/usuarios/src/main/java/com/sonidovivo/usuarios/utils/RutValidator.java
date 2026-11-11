package com.sonidovivo.usuarios.utils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RutValidator implements ConstraintValidator<ValidRut, String> {

    @Override
    public boolean isValid(String rut, ConstraintValidatorContext context) {
        if (rut == null || rut.trim().isEmpty()) {
            return true;
        }
        return validarRutChileno(rut);
    }

    private boolean validarRutChileno(String rut) {
        try {
            // Limpiar puntos y guion
            String rutLimpio = rut.toUpperCase().replace(".", "").replace("-", "").trim();
            if (rutLimpio.length() < 2)
                return false;

            String cuerpo = rutLimpio.substring(0, rutLimpio.length() - 1);
            if (!cuerpo.matches("\\d+")) {
                return false;
            }
            char dv = rutLimpio.charAt(rutLimpio.length() - 1);

            int suma = 0;
            int multiplicador = 2;

            for (int i = cuerpo.length() - 1; i >= 0; i--) {
                suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
                multiplicador = (multiplicador == 7) ? 2 : multiplicador + 1;
            }

            int resto = 11 - (suma % 11);
            char dvEsperado;
            if (resto == 11) {
                dvEsperado = '0';
            } else if (resto == 10) {
                dvEsperado = 'K';
            } else {
                dvEsperado = Character.forDigit(resto, 10);
            }

            return dv == dvEsperado;
        } catch (Exception e) {
            return false;
        }
    }
}
