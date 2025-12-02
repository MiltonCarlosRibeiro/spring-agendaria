// src/main/java/com/agendaria/agendaria/web/controller/ProcedureController.java
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

    // --- NOVO: PUT (Atualizar) ---
    @PutMapping("/{id}")
    public Procedure update(@PathVariable Integer id, @RequestBody Procedure p) {
        // Verificação de existência omitida para simplicidade, mas é boa prática
        p.setId(id);
        return procedureRepository.save(p);
    }

    // --- NOVO: DELETE (Deletar) ---
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 (No Content) em caso de sucesso
    public void delete(@PathVariable Integer id) {
        procedureRepository.deleteById(id);
    }
}