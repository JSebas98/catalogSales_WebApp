/*
 * Interfaz que implementa MongoRepository para CRUD.
 */
package hipocalorico.reto5.crudRepository;

import hipocalorico.reto5.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Interfaz que implementa MongoRepository para CRUD.
 * @author J. Sebastián Beltrán S.
 */
public interface UserCrudRepository extends MongoRepository<User, Integer>{
    /**
     * Encontrar usuario por email.
     * @param email el correo del usuario.
     * @return el User correspondiente al correo si existe.
     */
    public Optional<User> findByEmail(String email);
    /**
     * Encontrar usuario por email AND contraseña.
     * @param email el email del usuario.
     * @param password la contraseña del usuario.
     * @return el User con ese email y password si existe.
     */
    public Optional<User> findByEmailAndPassword(String email, String password);
    /**
     * Encontrar usuarios con un mes de cumpleaños específico.
     * @param monthBirthDay el mes de cumpleaños a buscar.
     * @return una List de Users con ese mes de cumpleaños.
     */
    public List<User> findByMonthBirthtDay(String monthBirthDay);
    /**
     * Para seleccionar el usuario con el id máximo.
     * Corresponde a la consulta: db.usuarios.find().limit(1).sort({$natural:-1})
     * @return el User con el id más alto.
     */
    public Optional<User> findTopByOrderByIdDesc();
}
