package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.ProcedureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedures")
@RequiredArgsConstructor
public class ProcedureController {

    private final ProcedureRepository procedureRepository;

    @GetMapping
    public List<Procedure> findAll() {
        return procedureRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Procedure create(@RequestBody Procedure p) {
        return procedureRepository.save(p);
    }
}
