/*
 * Clase que representa un documento User.
 */
package hipocalorico.reto5.model;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Clase que representa un documento User.
 * @author J. Sebastián Beltrán S. 
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="users")
public class User {
    /**
     * Identificación única en BD.
     */
    @Id
    private Integer id;
    /**
     * Identificación del usuario.
     */
    private String identification;
    /**
     * Nombre del usuario.
     */
    private String name;
    /**
     * Fecha de cumpleaños.
     */
    private Date birthtDay;
    /**
     * Mes de cumpleaños.
     */
    private String monthBirthtDay;
    /**
     * Dirección usuario.
     */
    private String address;
    /**
     * Número celular usuario.
     */
    private String cellPhone;
    /**
     * Email de usuario.
     */
    private String email;
    /**
     * Contraseña usuario.
     */
    private String password;
    /**
     * Zona de usuario.
     */
    private String zone;
    /**
     * Tipo de usuario.
     */
    private String type;
}
