/*
 * Controlador para peticiones REST de Supplements.
 */
package hipocalorico.reto5.controller;

import hipocalorico.reto5.model.Supplement;
import hipocalorico.reto5.service.SupplementService;
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
 * Controlador para peticiones REST de Supplements.
 * @author J. Sebastián Beltrán S.
 */
@RestController
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("api/supplements")
public class SupplementController {
    /**
     * Instancia de SupplementsService.
     */
    @Autowired
    private SupplementService servicioSupp;
    
    /**
     * Petición GET para recuperar todos los productos.
     * @return una List de Supplements.
     */
    @GetMapping("/all")
    public List<Supplement> findAllSupplements(){
        return servicioSupp.findAllSupplements();
    }
    
    /**
     * Petición GET para recuperar un producto.
     * @param reference la referencia del producto que se recuperará.
     * @return una List de Supplements.
     */
    @GetMapping("/{reference}")
    public Optional<Supplement> findSupplement(@PathVariable("reference") String reference){
        return servicioSupp.findSupplement(reference);
    }
    
    /**
     * Petición GET para recuperar productos cuyo precio sea menor o igual al dado.
     * @param price el precio filtro.
     * @return una List de Supplements cuyo precio sea menor o igual al dado.
     */
    @GetMapping("/price/{price}")
    public List<Supplement> findSupplementsByPrice(@PathVariable("price") double price){
        return servicioSupp.findSupplementsByPrice(price);
    }
    
    /**
     * Petición GET para recuperar productos cuya descripción contenga el texto dado.
     * @param description el texto filtro.
     * @return una List de Supplements cuya descripción contenga el texto dado.
     */
    @GetMapping("/description/{description}")
    public List<Supplement> findSupplementsByDescription(@PathVariable("description") String description){
        return servicioSupp.findSupplementsByDescription(description);
    }
    
    /**
     * Petición POST para crear productos.
     * @param supplement el Supplements que se guardará en la colección.
     * @return el Supplements creado.
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Supplement createSupplement(@RequestBody Supplement supplement){
        return servicioSupp.createSupplement(supplement);
    }
    
    /**
     * Petición PUT para actualizar productos.
     * @param supplement el Supplements con la info que se actualizará.
     * @return el Supplements actualizado.
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Supplement updateSupplement(@RequestBody Supplement supplement){
        return servicioSupp.updateSupplement(supplement);
    }
    
    /**
     * Petición DELETE para borrar productos.
     * @param reference la referencia del producto que se borrará.
     * @return true si se pudo borrar el producto; false si no se pudo borrar.
     */
    @DeleteMapping("/{reference}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteSupplement(@PathVariable("reference") String reference){
        return servicioSupp.deleteSupplement(reference);
    }
}