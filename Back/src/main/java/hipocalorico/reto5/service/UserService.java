/*
 * Servicio para lógica y restricciones de CRUD para User.
 */
package hipocalorico.reto5.service;

import hipocalorico.reto5.model.User;
import hipocalorico.reto5.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para lógica y restricciones de CRUD para User.
 * @author J. Sebastián Beltrán S.
 */
@Service
public class UserService {
    /**
     * Instancia de repositorio User.
     */
    @Autowired
    private UserRepository userRepo;
    
    /**
     * Recuperar todos los Users de la colección.
     * @return una List de todos los Users en la colección.
     */
    public List<User> findAllUsers(){
        return userRepo.findAllUsers();
    }
    
    /**
     * Recuperar un User de la colección mediante su id.
     * @param id el id que se buscará en la colección.
     * @return el User correspondiente al id, si existe.
     */
    public Optional<User> findUser(int id){
        return userRepo.findUser(id);
    }
    
    /**
     * Recuperar una lista de usuarios cuyo cumpleaños sea en el mes indicado.
     * @param month el mes de cumpleaños
     * @return una List con Users cuyo cumpleaños sea en el mes indicado.
     */
    public List<User> findUsersBirthdayMonth(String month){
        return userRepo.findUsersBirthdayMonth(month);
    }
    
    /**
     * Valida la existencia de un email en la colección.
     * @param email el email que se buscará en la colección.
     * @return true si el email existe; false si no existe.
     */
    public boolean emailExists(String email){
        return userRepo.emailExists(email);
    }
    
    /**
     * Autentica un usuario en la BD.
     * @param email el email del usuario que se autenticará.
     * @param password la contraseña del usuario que se autenticará.
     * @return el User existente en la BD o un nuevo usuario con valores null.
     */
    public User authUser(String email, String password){
        /**
         * Autenticar al usuario en la BD.
         */
        Optional<User> usuarioAutenticado = userRepo.authUser(email, password);
        
        if (usuarioAutenticado.isEmpty()){
            return new User();
        } else {
            return usuarioAutenticado.get();
        }
    }
    
    /**
     * Crea un nuevo User en la colección si no existe ya.
     * @param user el User se guardará en la colección.
     * @return el User creado.
     */
    public User createUser(User user){
        Optional<User> userIdMaximo = userRepo.lastUserId();
        /**
         * Si el User no tiene id, añadir el siguiente id disponible.
         */
        if (user.getId()==null){
            if (userIdMaximo.isEmpty()){
                user.setId(1);
            } else {
                user.setId(userIdMaximo.get().getId()+1);
            }
        }
        /**
         * Validar la existencia del User en la colección.
         * Si no existe, guardarlo.
         */
        Optional<User> usuario = userRepo.findUser(user.getId());
        if (usuario.isEmpty()){
            // Revisar si existe email.
            if (emailExists(user.getEmail()) == false){
                return userRepo.createUser(user);
            } else {
                return user;
            }
        } else {
            return user;
        } 
    }
    
    /**
     * Actualiza un User de la colección.
     * @param user el User con la información actualizada.
     * @return el User actualizado.
     */
    public User updateUser(User user){
        /**
         * Validar que el User tenga un id.
         */
        if (user.getId() != null){
            /**
             * Traer User que se actualizará.
             */
            Optional<User> userDb = userRepo.findUser(user.getId());
            /**
             * Si el User existe en la colección, ajustar la información.
             */
            if (!userDb.isEmpty()){
                if (user.getIdentification() != null){
                    userDb.get().setIdentification(user.getIdentification());
                }
                if (user.getName() != null){
                    userDb.get().setName(user.getName());
                }
                if (user.getAddress() != null){
                    userDb.get().setAddress(user.getAddress());
                }
                if (user.getBirthtDay() != null){
                    userDb.get().setBirthtDay(user.getBirthtDay());
                }
                if (user.getMonthBirthtDay() != null){
                    userDb.get().setMonthBirthtDay(user.getMonthBirthtDay());
                }
                if (user.getCellPhone() != null){
                    userDb.get().setCellPhone(user.getCellPhone());
                }
                if (user.getEmail() != null){
                    userDb.get().setEmail(user.getEmail());
                }
                if (user.getPassword() != null){
                    userDb.get().setPassword(user.getPassword());
                }
                if (user.getZone() != null){
                    userDb.get().setZone(user.getZone());
                }
                if (user.getType() != null){
                    userDb.get().setType(user.getType());
                }
                /**
                 * Actualizar User.
                 */
                userRepo.updateUser(userDb.get());
                /**
                 * Retornar User actualizado.
                 */
                return userDb.get();
            } else {
                return user;
            }
        } else {
            return user;
        }
    }
    
    /**
     * Borra un User de la colección.
     * @param userId el id del User que se borrará.
     * @return true si pudo borrarse; false si no se pudo borrar.
     */
    public boolean deleteUser(int userId){
        /**
         * Aplicar map para borrar todos los Users con el Id.
         */
        Boolean wasSuccessful = findUser(userId).map(user -> {
            userRepo.deleteUser(user);
            return true;
        }).orElse(false);
        
        return wasSuccessful;
    }   
}