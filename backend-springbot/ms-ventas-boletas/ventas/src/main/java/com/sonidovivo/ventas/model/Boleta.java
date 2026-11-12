package com.sonidovivo.ventas.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_orden", unique = true)
    private String numeroOrden;

    @Column(name = "codigo_orden", unique = true)
    private String codigoOrden;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @NotBlank
    @Column(name = "cliente_nombre", nullable = false)
    private String clienteNombre;

    @NotBlank
    @Column(name = "cliente_apellidos", nullable = false)
    private String clienteApellidos;

    @NotBlank
    @Email
    @Column(name = "cliente_email", nullable = false)
    private String clienteEmail;

    @NotBlank
    @Column(nullable = false)
    private String calle;

    private String departamento;

    @NotBlank
    @Column(nullable = false)
    private String region;

    @NotBlank
    @Column(nullable = false)
    private String comuna;

    private String indicaciones;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer total;

    @NotBlank
    @Column(nullable = false)
    private String estado;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DetalleBoleta> items = new ArrayList<>();

    public Boleta() {
    }

    @PrePersist
    protected void alCrear() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
        if (estado == null || estado.isBlank()) {
            estado = "completada";
        }
    }

    public void agregarDetalle(DetalleBoleta detalle) {
        items.add(detalle);
        detalle.setBoleta(this);
    }

    public void quitarDetalle(DetalleBoleta detalle) {
        items.remove(detalle);
        detalle.setBoleta(null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroOrden() { return numeroOrden; }
    public void setNumeroOrden(String numeroOrden) { this.numeroOrden = numeroOrden; }
    public String getCodigoOrden() { return codigoOrden; }
    public void setCodigoOrden(String codigoOrden) { this.codigoOrden = codigoOrden; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    public String getClienteApellidos() { return clienteApellidos; }
    public void setClienteApellidos(String clienteApellidos) { this.clienteApellidos = clienteApellidos; }
    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }
    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public String getIndicaciones() { return indicaciones; }
    public void setIndicaciones(String indicaciones) { this.indicaciones = indicaciones; }
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public List<DetalleBoleta> getItems() { return items; }
    public void setItems(List<DetalleBoleta> items) {
        this.items.clear();
        if (items != null) {
            items.forEach(this::agregarDetalle);
        }
    }
}
