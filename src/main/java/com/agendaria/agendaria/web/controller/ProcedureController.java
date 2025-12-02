package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.ProcedureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    /** Atualiza um procedimento existente. (NOVO: PUT) */
    @PutMapping("/{id}")
    public Procedure update(@PathVariable Integer id, @RequestBody Procedure p) {
        if (!procedureRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Procedimento não encontrado para atualização.");
        }
        p.setId(id);
        return procedureRepository.save(p);
    }

    /** Deleta um procedimento. (NOVO: DELETE) */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 (No Content)
    public void delete(@PathVariable Integer id) {
        procedureRepository.deleteById(id);
    }


}