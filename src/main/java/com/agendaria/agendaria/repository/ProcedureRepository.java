package com.agendaria.agendaria.repository;

import com.agendaria.agendaria.domain.model.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureRepository extends JpaRepository<Procedure, Integer> {
}
