package com.example.highenddetailing.servicessubdomain.datalayer;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ServiceRepository extends JpaRepository <Service, Integer> {

}
