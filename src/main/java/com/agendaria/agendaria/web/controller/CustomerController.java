package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.domain.model.Customer;
import com.agendaria.agendaria.repository.BusinessRepository;
import com.agendaria.agendaria.repository.CustomerRepository;
import com.agendaria.agendaria.web.dto.CustomerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final BusinessRepository businessRepository;

    private Business getDefaultBusiness() {
        return businessRepository.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Business padrão não encontrado (id=1)"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto create(@RequestBody CustomerDto dto) {
        Business business = getDefaultBusiness();
        Customer c = Customer.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .business(business)
                .build();
        c = customerRepository.save(c);
        CustomerDto out = new CustomerDto();
        out.setId(c.getId());
        out.setName(c.getName());
        out.setPhone(c.getPhone());
        return out;
    }
}
