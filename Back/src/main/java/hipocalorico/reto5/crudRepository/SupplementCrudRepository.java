/*
 * Interfaz que implementa MongoRepository para CRUD.
 */
package hipocalorico.reto5.crudRepository;

import hipocalorico.reto5.model.Supplement;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * Interfaz que implementa MongoRepository para CRUD.
 * @author J. Sebastián Beltrán S.
 */
public interface SupplementCrudRepository extends MongoRepository<Supplement, String>{
    /**
     * Retorna una lista de productos cuyo precio sea menor al indicado.
     * @param price el precio filtro.
     * @return una Lista de Supplements cuyo precio sea menor o igual al dado.
     */
    public List<Supplement> findByPriceLessThanEqual(double price);
    
    /**
     * Retorna una lista de productos cuya descripción contenga el texto dado.
     * @param description el texto que se buscará.
     * @return una Lista de Supplements cuya descripción contenga el texto dado.
     */
    @Query("{'description':{'$regex':'?0','$options':'i'}}")
    public List<Supplement> findByDescriptionLike(String description);
}
