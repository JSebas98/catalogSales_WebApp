/*
 * Interfaz que implementa MongoRepository para CRUD.
 */
package hipocalorico.reto5.crudRepository;

import hipocalorico.reto5.model.Order;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * Interfaz que implementa MongoRepository para CRUD.
 * @author J. Sebastián Beltrán S.
 */
public interface OrderCrudRepository extends MongoRepository<Order, Integer>{
    /**
     * Recuperar lista de órdenes por zona.
     * @param zone la zona en la que se buscarán las órdenes.
     * @return una lista de Órdenes pertenecientes a la zona.
     */
    @Query("{'salesMan.zone': ?0}")
    List<Order> findByZone(final String zone);
    
    /**
     * Recupera el objeto Order con el id más alto.
     * @return el Order con el id más alto, si existe.
     */
    public Optional<Order> findTopByOrderByIdDesc();
}
