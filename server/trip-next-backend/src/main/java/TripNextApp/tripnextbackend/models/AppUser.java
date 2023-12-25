package TripNextApp.tripnextbackend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "appuser")
public class AppUser {

    @Id
    private String userID;
    
    @Column(name = "userEmail")
    private String userEmail;

    @Column(name = "flights")
    private String flights;
}