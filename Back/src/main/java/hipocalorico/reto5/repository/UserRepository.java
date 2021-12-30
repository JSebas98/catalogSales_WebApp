/*
 * Clase que representa un repositorio entre CRUD repository y service.
 */
package hipocalorico.reto5.repository;

import hipocalorico.reto5.model.User;
import hipocalorico.reto5.crudRepository.UserCrudRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Clase que representa un repositorio entre CRUD repository y service.
 * @author J. Sebastián Beltrán S.
 */
@Repository
public class UserRepository {
    /**
     * Instancia de UserCrudRepository.
     */
    @Autowired
    private UserCrudRepository userCrudRepo;
    
    /**
     * Recuperar una Lista con todos los Users de la colección.
     * @return una List de los Users en la colección.
     */
    public List<User> findAllUsers(){
        return userCrudRepo.findAll();
    }
    
    /**
     * Recuperar un User de la colección.
     * @param id el id del User.
     * @return el User con el id correspondiente si existe.
     */
    public Optional<User> findUser(int id){
        return userCrudRepo.findById(id);
    }
    
    /**
     * Recuperar una lista con todos los usuarios cuyos cumpleaños sean en el
     * mes indicado
     * @param month el mes indicado.
     * @return una List con los Users cuyo mes de cumpleaños sea el indicado.
     */
    public List<User> findUsersBirthdayMonth(String month){
        return userCrudRepo.findByMonthBirthtDay(month);
    }
    
    /**
     * Crear nuevo User en la colección.
     * @param user el User que se guardará.
     * @return el User guardado.
     */
    public User createUser(User user){
        return userCrudRepo.save(user);
    }
    
    /**
     * Actualizar User de la colección.
     * @param user el User con la nueva información.
     * @return el User con la información actualizada.
     */
    public User updateUser(User user){
        return userCrudRepo.save(user);
    }
    
    /**
     * Borrar User de la colección.
     * @param user el User que se borrará.
     */
    public void deleteUser(User user){
        userCrudRepo.delete(user);
    }
    
    /**
     * Validar la existencia de un email en la colección.
     * @param email el email con el que se buscará el User.
     * @return true si existe el email; false si no existe.
     */
    public boolean emailExists(String email){
        /**
         * Buscar usuario usando email.
         */
        Optional<User> usuario = userCrudRepo.findByEmail(email);
        /**
         * Si existe, retornar true; si no existe, retornar false.
         */
        return !usuario.isEmpty();
    }
    
    /**
     * Autenticar un User en la colección.
     * @param email el email con el que se autenticará el User.
     * @param password el password con el que se autenticará el User.
     * @return el User si existe.
     */
    public Optional<User> authUser(String email, String password){
        /**
         * Si existe, devuelve User. 
         */
        return userCrudRepo.findByEmailAndPassword(email, password);
    }
    
    /**
     * Recupera el usuario con el último ID.
     * @return el User con el último ID.
     */
    public Optional<User> lastUserId(){
        return userCrudRepo.findTopByOrderByIdDesc();
    }
}
