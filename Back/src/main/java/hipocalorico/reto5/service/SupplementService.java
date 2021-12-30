/*
 * Servicio para lógica y restricciones de CRUD para Supplements.
 */
package hipocalorico.reto5.service;

import hipocalorico.reto5.model.Supplement;
import hipocalorico.reto5.repository.SupplementRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para lógica y restricciones de CRUD para Supplements.
 * @author J. Sebastián Beltrán S.
 */
@Service
public class SupplementService {
    /**
     * Instancia de repositorio de Supplements.
     */
    @Autowired
    private SupplementRepository suppRepo;
    
    /**
     * Recuperar todos los productos de la colección.
     * @return una List con todos los Supplements.
     */
    public List<Supplement> findAllSupplements(){
        return suppRepo.findAllSupplements();
    }
    
    /**
     * Recuperar un producto de la colección si este existe.
     * @param reference la referencia del productoque se buscará.
     * @return el Supplements si existe.
     */
    public Optional<Supplement> findSupplement(String reference){
        return suppRepo.findSupplement(reference);
    }
    
    /**
     * Recuperar productos cuyo precio sea igual o menor al dado.
     * @param price el precio filtro.
     * @return una List de Supplements cuyo precio sea menor o igual al precio dado
     */
    public List<Supplement> findSupplementsByPrice(double price){
        return suppRepo.findSupplementsByPrice(price);
    }
    
    /**
     * Recuperar productos cuya descripción contenga el texto dado.
     * @param description el texto filtro.
     * @return una List de Supplements cuya descripción contenga el texto dado.
     */
    public List<Supplement> findSupplementsByDescription(String description){
        return suppRepo.findSupplementsByDescription(description);
    }
    
    /**
     * Crear un producto en la colección.
     * @param supplement el Supplements que se creará.
     * @return el Supplements creado.
     */
    public Supplement createSupplement(Supplement supplement){
        if (supplement.getReference() == null){
            return supplement;
        } else {
            Optional<Supplement> suppBD = findSupplement(supplement.getReference());
            if (!suppBD.isEmpty()){
                return supplement;
            } else {
                return suppRepo.createSupplement(supplement);
            }
        }
    }
    
    /**
     * Actualizar un producto en la colección.
     * @param supplement el Supplements con la info actualizada.
     * @return el Supplements actualizado.
     */
    public Supplement updateSupplement(Supplement supplement){
        if (supplement.getReference() == null){
            return supplement;
        } else {
            Optional<Supplement> suppBD = findSupplement(supplement.getReference());
            if (!suppBD.isEmpty()){
                if (supplement.getBrand() != null){
                    suppBD.get().setBrand(supplement.getBrand());
                }
                if (supplement.getCategory() != null){
                    suppBD.get().setCategory(supplement.getCategory());
                }
                if (supplement.getObjetivo() != null){
                    suppBD.get().setObjetivo(supplement.getObjetivo());
                }
                if (supplement.getDescription() != null){
                    suppBD.get().setDescription(supplement.getDescription());
                }
                if (supplement.getPrice() != 0.0){
                    suppBD.get().setPrice(supplement.getPrice());
                }
                if (supplement.getQuantity() != 0){
                    suppBD.get().setQuantity(supplement.getQuantity());
                }
                if (supplement.getPhotography() != null){
                    suppBD.get().setPhotography(supplement.getPhotography());
                }
                suppBD.get().setAvailability(supplement.isAvailability());
                /**
                 * Actualizar producto con nueva info.
                 */
                suppRepo.updateSupplement(suppBD.get());
                /**
                 * Return el objeto actualizado.
                 */
                return suppBD.get();
            } else {
                return supplement;
            }
        }
    }
    
    /**
     * Borra un producto de la colección.
     * @param reference la referencia del producto que se borrará.
     * @return true si pudo borrarse el producto; false si no se pudo.
     */
    public boolean deleteSupplement(String reference){
        Boolean wasSuccessful = findSupplement(reference).map(supplement -> {
            suppRepo.deleteSupplement(supplement);
            return true;
        }).orElse(false);
        
        return wasSuccessful;
    }
}