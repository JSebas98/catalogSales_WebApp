/*
 * Clase que representa un documento Order.
 */
package hipocalorico.reto5.model;

import java.util.Date;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Clase que representa un documento Order.
 * @author J. Sebastián Beltrán S.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="orders")
public class Order {
    /**
     * Posible estados de la orden.
     */
    public static String PENDING = "Pendiente";
    public static String APPROVED = "Aprobada";
    public static String REJECTED = "Rechazada";
    /**
     * Id de la orden (autogenerada en el Service).
     */
    @Id
    private Integer id;
    /**
     * Fecha de registro de la orden.
     */
    private Date registerDay;
    /**
     * Estatus de la orden.
     */
    private String status;
    /**
     * Asesor comercial asociado.
     */
    private User salesMan;
    /**
     * Map con los productos de la orden.
     */
    private Map<String, Supplement> products;
    /**
     * Map con referencia productos y cantidad.
     */
    private Map<String, Integer> quantities;
}