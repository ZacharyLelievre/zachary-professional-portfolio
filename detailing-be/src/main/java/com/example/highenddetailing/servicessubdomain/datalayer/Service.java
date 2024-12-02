package com.example.highenddetailing.servicessubdomain.datalayer;

import jakarta.persistence.*;
import lombok.*;


@Data
@Table(name = "services")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Embedded
    private ServiceIdentifier serviceIdentifier;
    private String serviceName;
    private String timeRequired;
    private float price;


    public Service(String serviceName, String timeRequired, float price){
        this.serviceIdentifier = new ServiceIdentifier();
        this.serviceName = serviceName;
        this.timeRequired = timeRequired;
        this.price = price;
    }
}
