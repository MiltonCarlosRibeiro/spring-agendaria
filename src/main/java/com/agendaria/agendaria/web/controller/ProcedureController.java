package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.BusinessRepository;
import com.agendaria.agendaria.repository.ProcedureRepository;
import com.agendaria.agendaria.web.dto.ProcedureDto;
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
    private final BusinessRepository businessRepository;

    private Business getDefaultBusiness() {
        return businessRepository.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Business padrão não encontrado (id=1)"));
    }

    @GetMapping
    public List<ProcedureDto> list() {
        return procedureRepository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProcedureDto create(@RequestBody ProcedureDto dto) {
        Business business = getDefaultBusiness();
        Procedure p = Procedure.builder()
                .name(dto.getName())
                .durationMinutes(dto.getDurationMinutes())
                .price(dto.getPrice())
                .active(Boolean.TRUE.equals(dto.getActive()))
                .business(business)
                .build();
        p = procedureRepository.save(p);
        return toDto(p);
    }

    @PutMapping("/{id}")
    public ProcedureDto update(@PathVariable Long id, @RequestBody ProcedureDto dto) {
        Procedure p = procedureRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Procedimento não encontrado"));
        p.setName(dto.getName());
        p.setDurationMinutes(dto.getDurationMinutes());
        p.setPrice(dto.getPrice());
        p.setActive(Boolean.TRUE.equals(dto.getActive()));
        return toDto(procedureRepository.save(p));
    }

    private ProcedureDto toDto(Procedure p) {
        ProcedureDto dto = new ProcedureDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDurationMinutes(p.getDurationMinutes());
        dto.setPrice(p.getPrice());
        dto.setActive(p.getActive());
        return dto;
    }
}
