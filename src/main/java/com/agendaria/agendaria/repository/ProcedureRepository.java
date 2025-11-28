package com.agendaria.agendaria.repository;

import com.agendaria.agendaria.domain.model.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcedureRepository extends JpaRepository<Procedure, Long> {
    List<Procedure> findByActiveTrue();
}
