/*
 * Clase que representa un Documento Suplemento.
 */
package hipocalorico.reto5.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Clase que representa un documento Suplemento.
 * @author J. Sebastián Beltrán S.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="supplements")
public class Supplement {
    /**
     * Referencia única en BD.
     */
    @Id
    private String reference;
    /**
     * Marca de suplemento.
     */
    private String brand;
    /**
     * Categoría de suplemento.
     */
    private String category;
    /**
     * Objetivo de suplemento.
     */
    private String objetivo;
    /**
     * Descripción de suplemento.
     */
    private String description;
    /**
     * Disponibilidad de suplemento; por defecto = true.
     */
    private boolean availability = true;
    /**
     * Precio de suplemento.
     */
    private double price;
    /**
     * Cantidad de suplemento.
     */
    private int quantity;
    /**
     * Link a fotografía de suplemento.
     */
    private String photography;
}
