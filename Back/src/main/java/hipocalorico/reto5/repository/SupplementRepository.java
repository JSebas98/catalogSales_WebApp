/*
 * Clase que representa un Repositorio para Supplements.
 */
package hipocalorico.reto5.repository;

import hipocalorico.reto5.model.Supplement;
import hipocalorico.reto5.crudRepository.SupplementCrudRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Clase que representa un Repositorio para Supplements.
 * @author J. Sebastián Beltrán S.
 */
@Repository
public class SupplementRepository {
    /**
     * Instancia de CrudRepository.
     */
    @Autowired
    private SupplementCrudRepository suppCrudRepo;
    
    /**
     * Recuperar todos los productos en la colección.
     * @return una List con todos los Supplements.
     */
    public List<Supplement> findAllSupplements(){
        return suppCrudRepo.findAll();
    }
    
    /**
     * Recuperar un producto de la colección.
     * @param reference la referencia del Supplements que se recuperará.
     * @return el Supplements buscado si existe en la colección.
     */
    public Optional<Supplement> findSupplement(String reference){
        return suppCrudRepo.findById(reference);
    }
    
    /**
     * Recuperar productos cuyo precio sea igual o menor al dado.
     * @param price el precio filtro.
     * @return una List de Supplements cuyo precio sea menor o igual al precio dado
     */
    public List<Supplement> findSupplementsByPrice(double price){
        return suppCrudRepo.findByPriceLessThanEqual(price);
    }
    
    /**
     * Recuperar productos cuya descripción contenga el texto dado.
     * @param description el texto filtro.
     * @return una List de Supplements cuya descripción contenga el texto dado.
     */
    public List<Supplement> findSupplementsByDescription(String description){
        return suppCrudRepo.findByDescriptionLike(description);
    }
    
    /**
     * Crea un nuevo producto en la colección.
     * @param supplement el Supplements que se creará.
     * @return el Supplements creado.
     */
    public Supplement createSupplement(Supplement supplement){
        return suppCrudRepo.save(supplement);
    }
    
    /**
     * Actualizar un producto de la colección.
     * @param supplement el Supplements con la info actualizada.
     * @return el Supplements actualizado.
     */
    public Supplement updateSupplement(Supplement supplement){
        return suppCrudRepo.save(supplement);
    }
    
    /**
     * Borra un producto de la colección.
     * @param supplement el producto que se borrará.
     */
    public void deleteSupplement(Supplement supplement){
        suppCrudRepo.delete(supplement);
    }
}