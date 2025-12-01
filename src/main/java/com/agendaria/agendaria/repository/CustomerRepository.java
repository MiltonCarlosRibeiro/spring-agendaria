package com.agendaria.agendaria.repository;

import com.agendaria.agendaria.domain.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
