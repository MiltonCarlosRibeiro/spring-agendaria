package com.agendaria.agendaria.repository;

import com.agendaria.agendaria.domain.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, Integer> {
}
