/*
 * Clase que representa un Repositorio para Order.
 */
package hipocalorico.reto5.repository;

import hipocalorico.reto5.model.Order;
import hipocalorico.reto5.crudRepository.OrderCrudRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

/**
 * Clase que representa un Repositorio para Order.
 * @author J. Sebastián Beltrán S.
 */
@Repository
public class OrderRepository {
    /**
     * Instancia de OrderCrudRepository.
     */
    @Autowired
    private OrderCrudRepository orderCrud;
    
    /**
     * Instancia de MongoTemplate.
     */
    @Autowired
    private MongoTemplate mongoTemplate;
    
    /**
     * Recupera todas las órdenes de la BD.
     * @return una Lista de Orders.
     */
    public List<Order> findAllOrders(){
        return (List<Order>) orderCrud.findAll();
    }
    
    /**
     * Recupera una orden (si existe) de la BD.
     * @param id el id de la orden a localizar.
     * @return la Order si existe.
     */
    public Optional<Order> findOrder(int id){
        return orderCrud.findById(id);
    }
    
    /**
     * Recupera la orden con el id más alto de la BD.
     * @return la Order con el id más alto si existe algún registro.
     */
    public Optional<Order> findLastOrder(){
        return orderCrud.findTopByOrderByIdDesc();
    }
    
    /**
     * Recupera las órdenes creadas en una zona determinada.
     * @param zone la zona en la que deben buscarse las órdenes.
     * @return una Lista de Orders pertenecientes a esa zona.
     */
    public List<Order> findOrdersInZone(String zone){
        return orderCrud.findByZone(zone);
    }
    
    /**
     * Recupera las órdenes realizadas por un asesor.
     * @param id el id del asesor.
     * @return una List de Orders por asesor.
     */
    public List<Order> findOrdersBySalesMan(Integer id){
        // Instancia de objeto Query
        Query query = new Query();
        // Crear Criteria para hacer una query personalizada.
        Criteria salesManCriteria = Criteria.where("salesMan.id").is(id);
        // Añadir Criteria a Query
        query.addCriteria(salesManCriteria);
        // Lanzar query personalizada
        List<Order> foundOrders = mongoTemplate.find(query, Order.class);
        
        return foundOrders;
    }
    
    /**
     * Recupera las órdenes según su estado y el asesor que las realizó.
     * @param id el id del asesor.
     * @param status el estado de la orden.
     * @return una List de Orders por asesor y estado.
     */
    public List<Order> findOrdersBySalesManAndStatus(Integer id, String status){
        // Instancia de objeto Query.
        Query query = new Query();
        // Crear Criteria para hacer query personalizada.
        Criteria statusCriteria = Criteria.where("salesMan.id").is(id)
                                .and("status").is(status);
        // Añadir Criteria a query.
        query.addCriteria(statusCriteria);
        // Lanzar query personalizada.
        List<Order> foundOrders = mongoTemplate.find(query, Order.class);
        
        return foundOrders;
    }
    
    public List<Order> findOrdersBySalesManAndDate(Integer id, String dateStr){
        // Instancia de DateTimeFormatter
        DateTimeFormatter dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // Instancia de Query.
        Query query = new Query();
        // Crear Criteria para query personalizada.
        Criteria dateCriteria = Criteria.where("registerDay")
                .gte(LocalDate.parse(dateStr, dtFormatter).minusDays(1).atStartOfDay())
                .lt(LocalDate.parse(dateStr,dtFormatter).plusDays(2).atStartOfDay())
                .and("salesMan.id").is(id);
        // Añadir Criteria a Query
        query.addCriteria(dateCriteria);
        // Lanzar query personalizada.
        List<Order> foundOrders = mongoTemplate.find(query, Order.class);
        
        return foundOrders;
    }
    
    /**
     * Crea una nueva orden en la BD.
     * @param order la orden que se guardará.
     * @return la Orden guardada.
     */
    public Order createOrder(Order order){
        return orderCrud.save(order);
    }
    
    /**
     * Actualiza una orden en la BD.
     * @param order la orden con los nuevos datos.
     * @return la Orden actualizada.
     */
    public Order updateOrder(Order order){
        return orderCrud.save(order);
    }
    
    /**
     * Borra una orden de la BD.
     * @param order la orden que se borrará.
     */
    public void deleteOrder(Order order){
        orderCrud.delete(order);
    }
}
