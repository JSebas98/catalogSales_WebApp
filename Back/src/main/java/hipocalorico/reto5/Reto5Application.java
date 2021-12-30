package hipocalorico.reto5;

import hipocalorico.reto5.crudRepository.OrderCrudRepository;
import hipocalorico.reto5.crudRepository.SupplementCrudRepository;
import hipocalorico.reto5.crudRepository.UserCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Reto5Application {

        @Autowired
        private UserCrudRepository userCrud;
        
        @Autowired
        private SupplementCrudRepository supplementCrud;
        
        @Autowired
        private OrderCrudRepository orderCrud;
    
	public static void main(String[] args) {
		SpringApplication.run(Reto5Application.class, args);
	}

        public void run(String... args) throws Exception{
            userCrud.deleteAll();
            supplementCrud.deleteAll();
            orderCrud.deleteAll();
        }
}
