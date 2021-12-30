/*
 * Servicio para lógica y restricciones de CRUD para Order.
 */
package hipocalorico.reto5.service;

import hipocalorico.reto5.model.Order;
import hipocalorico.reto5.repository.OrderRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para lógica y restricciones de CRUD para Order.
 * @author J. Sebastián Beltrán S.
 */
@Service
public class OrderService {
    /**
     * Instancia de OrderRepository.
     */
    @Autowired
    private OrderRepository orderRepo;
    
    /**
     * Recupera todas las Orders de la BD.
     * @return una List de Orders.
     */
    public List<Order> findAllOrders(){
        return orderRepo.findAllOrders();
    }
    
    /**
     * Recupera una orden de la BD si existe.
     * @param id el id de la orden a localizar.
     * @return la Order si existe.
     */
    public Optional<Order> findOrder(int id){
        return orderRepo.findOrder(id);
    }
    
    /**
     * Recupera las ordenes realizadas en una zona.
     * @param zone la zona en la que se buscarán las órdenes.
     * @return una List con las Orders creadas en esa zona.
     */
    public List<Order> findOrdersInZone(String zone){
        return orderRepo.findOrdersInZone(zone);
    }
    
    /**
     * Recupera las órdenes realizadas por un asesor.
     * @param id el id del asesor.
     * @return una List con las Orders hechas por el asesor.
     */
    public List<Order> findOrdersBySalesMan(Integer id){
        return orderRepo.findOrdersBySalesMan(id);
    }
    
    /**
     * Recupera las órdenes según estado y asesor.
     * @param id el id del asesor.
     * @param status el estado de la orden.
     * @return una List de Orders que cumplan los requisitos.
     */
    public List<Order> findOrdersBySalesManAndStatus(Integer id, String status){
        return orderRepo.findOrdersBySalesManAndStatus(id, status);
    }
    
    /**
     * Recupera las órdenes según fecha de registro y asesor.
     * @param id el id del asesor.
     * @param dateStr la fecha de registro de la orden.
     * @return una List de Orders que cumplan los requisitos.
     */
    public List<Order> findOrderBySalesManAndDate(Integer id, String dateStr){
        return orderRepo.findOrdersBySalesManAndDate(id, dateStr);
    } 
    
    /**
     * Recupera la orden con el id más alto de la BD.
     * @return la Order con el id más alto de la BD.
     */
    public Optional<Order> findLastOrder(){
        return orderRepo.findLastOrder();
    }
    
    /**
     * Crea una nueva orden en la BD si esta no existe ya.
     * @param order la orden que se creará.
     * @return la Order creada (si es exitoso) o la Order pasada si no lo es.
     */
    public Order createOrder(Order order){
        // Recuperar última orden registrada.
        Optional<Order> lastOrder = findLastOrder();
        /**
         * Generar id de orden si no lo tiene ya.
         */
        if (order.getId() == null){
            // Si no hay última órden, asignar id=1; si no, id de la última
            // orden + 1
            if (!lastOrder.isEmpty()){
                order.setId(lastOrder.get().getId() + 1);
            } else {
                order.setId(1);
            }
        }
        /**
         * Validar la existencia de la orden en la BD. Si no existe, guardarala.
         */
        Optional<Order> orderBD = orderRepo.findOrder(order.getId());
        
        if (orderBD.isEmpty()){
            return orderRepo.createOrder(order);
        } else {
            return order;
        }
    }
    
    /**
     * Actualiza una orden en la BD.
     * @param order la orden con la nueva información.
     * @return la Order actualizada (éxito) o la Order pasada (fracaso).
     */
    public Order updateOrder(Order order){
        /**
         * Validar que la orden tenga id.
         */
        if (order.getId() != null){
            // Buscar la orden en la BD.
            Optional<Order> orderActu = orderRepo.findOrder(order.getId());
            // Si encuentra la orden, actualice el estado. Si no, retorne la
            // orden pasada.
            if (!orderActu.isEmpty()){
                if (order.getStatus() != null){
                    orderActu.get().setStatus(order.getStatus());
                    orderRepo.updateOrder(orderActu.get());
                    return orderActu.get();
                } else {
                    return order;
                }
            } else {
                return order;
            }
        } else {
            return order;
        }
    }
    
    /**
     * Borra una orden de la BD.
     * @param orderId el id de la orden que se borrará.
     * @return true si pudo borrarse la Orded; false en caso contrario.
     */
    public boolean deleteOrder(int orderId){
        /**
         * Aplicar map para borrar todas las ocurrencias de la orden.
         */
        Boolean wasSuccessful = findOrder(orderId).map(order -> {
            orderRepo.deleteOrder(order);
            return true;
        }).orElse(false);
        
        return wasSuccessful;
    }
}