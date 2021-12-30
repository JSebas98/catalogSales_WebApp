/*
 * Controlador REST para User.
 */
package hipocalorico.reto5.controller;

import hipocalorico.reto5.model.User;
import hipocalorico.reto5.service.UserService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para User.
 * @author J. Sebastián Beltrán S.
 */
@RestController
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/api/user")
public class UserController {
    /**
     * Instancia del servicio User.
     */
    @Autowired
    private UserService servicioUser;
    
    /**
     * Petición GET para recuperar todos los Users.
     * @return una Lista de Users de la BD.
     */
    @GetMapping("/all")
    public List<User> findAllUsers(){
        return servicioUser.findAllUsers();
    }
    
    /**
     * Petición GET para recuperar un User específico.
     * @param id el id del User a recuperar.
     * @return el User si lo encuentra.
     */
    @GetMapping("/{id}")
    public Optional<User> findUser(@PathVariable("id") int id){
        return servicioUser.findUser(id);
    }
    
    /**
     * Petición GET para recuperar Users que cumplan años en el mes indicado.
     * @param month el mes de cumpleaños.
     * @return una List de Users que cumplan años en el mes indicado.
     */
    @GetMapping("/birthday/{month}")
    public List<User> findUsersBirthdayMonth(@PathVariable("month") String month){
        return servicioUser.findUsersBirthdayMonth(month);
    }
    
    /**
     * Petición GET para validar la existencia de un email.
     * @param email email que se validará.
     * @return true si el email existe; false si no existe.
     */
    @GetMapping("/emailexist/{email}")
    public boolean emailExists(@PathVariable("email") String email){
        return servicioUser.emailExists(email);
    }
    
    /**
     * Petición GET para autenticar a un usuario.
     * @param email el email con el que el usuario se autenticará.
     * @param password la contraseña con la que el usuario se autenticará.
     * @return el User de la BD si se autentica; un User con valores null si no
     *         se autentica.
     */
    @GetMapping("/{email}/{password}")
    public User authUser(@PathVariable("email") String email,
                         @PathVariable("password") String password){
        return servicioUser.authUser(email, password);
    }
    
    /**
     * Petición POST para crear un nuevo User en la BD.
     * @param user el User que se guardará.
     * @return el User guardado.
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody User user){
        return servicioUser.createUser(user);
    }
    
    /**
     * Petición PUT para actualizar un User en la BD.
     * @param user el User con la información nueva.
     * @return el User actualizado.
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public User updateUser(@RequestBody User user){
        return servicioUser.updateUser(user);
    }
    
    /**
     * Petición DELETE para borrar un User de la BD.
     * @param id el id del User que se borrará.
     * @return true si pudo borrarse; false si no pudo borrarse.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteUser(@PathVariable("id") int id){
        return servicioUser.deleteUser(id);
    }
}