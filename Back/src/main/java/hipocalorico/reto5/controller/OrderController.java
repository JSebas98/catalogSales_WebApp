/*
 * Controlador Rest para peticiones GET, POST, PUT y DELETE en Orders.
 */
package hipocalorico.reto5.controller;

import hipocalorico.reto5.model.Order;
import hipocalorico.reto5.service.OrderService;
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
 * Controlador Rest para peticiones GET, POST, PUT y DELETE en Orders.
 * @author J. Sebastián Beltrán S.
 */
@RestController
@RequestMapping("api/order")
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class OrderController {
    /**
     * Instancia de OrderService.
     */
    @Autowired
    private OrderService servicioOrder;
    
    /**
     * Recupera todas las órdenes de la BD.
     * @return una List de todas las Orders en la BD.
     */
    @GetMapping("/all")
    public List<Order> getAllOrders(){
        return servicioOrder.findAllOrders();
    }
    
    /**
     * Recupera una orden en específico.
     * @param id el id de la orden a recuperar.
     * @return la Order si existe en BD.
     */
    @GetMapping("/{id}")
    public Optional<Order> getOrder(@PathVariable("id") int id){
        return servicioOrder.findOrder(id);
    }
    
    /**
     * Recupera las órdenes realizadas en una zona.
     * @param zone la zona en la que se buscarán las órdenes.
     * @return una List de Orders realizadas en la zona de búsqueda.
     */
    @GetMapping("/zona/{zone}")
    public List<Order> getOrdersByZone(@PathVariable("zone") String zone){
        return servicioOrder.findOrdersInZone(zone);
    }
    
    /**
     * Recupera las órdenes realizadas por un asesor.
     * @param id el id del asesor.
     * @return una List de Orders realizadas por el asesor.
     */
    @GetMapping("/salesman/{id}")
    public List<Order> getOrdersBySalesMan(@PathVariable("id") Integer id){
        return servicioOrder.findOrdersBySalesMan(id);
    }
    
    /**
     * Recupera las órdenes realizadas por asesor y fecha.
     * @param id el id del asesor
     * @param dateStr la fecha de registro de la orden.
     * @return una List de Orders por fecha y asesor.
     */
    @GetMapping("/date/{date}/{id}")
    public List<Order> getOrdersBySalesManAndDate(@PathVariable("id") Integer id,
                                          @PathVariable("date") String dateStr){
        return servicioOrder.findOrderBySalesManAndDate(id, dateStr);
    }
    
    /**
     * Recuper las órdenes realizadas por asesor y estado.
     * @param id el id del asesor.
     * @param status el estado de la orden.
     * @return una List de Orders por estado y asesor.
     */
    @GetMapping("/state/{status}/{id}")
    public List<Order> getOrdersBySalesManAndStatus(@PathVariable("id") Integer id,
                                        @PathVariable("status") String status){
        return servicioOrder.findOrdersBySalesManAndStatus(id, status);
    }
    
    /**
     * Crea una nueva orden en la BD.
     * @param order la orden que se creará.
     * @return la Order creada.
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@RequestBody Order order){
        return servicioOrder.createOrder(order);
    }
    
    /**
     * Actualiza una orden en la BD.
     * @param order la orden con la info nueva.
     * @return la Order actualizada.
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Order updateOrder(@RequestBody Order order){
        return servicioOrder.updateOrder(order);
    }
    
    /**
     * Borra una orden de la BD.
     * @param id el id de la orden a borrar.
     * @return true si se borró la Order; false en caso contrario.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean deleteOrder(@PathVariable("id") int id){
        return servicioOrder.deleteOrder(id);
    }
}
