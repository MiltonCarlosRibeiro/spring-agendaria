package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Customer;
import com.agendaria.agendaria.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Customer findById(@PathVariable Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@RequestBody Customer c) {
        return customerRepository.save(c);
    }

    /** Atualiza um cliente existente. (NOVO: PUT) */
    @PutMapping("/{id}")
    public Customer update(@PathVariable Integer id, @RequestBody Customer c) {
        // Verifica se o ID existe antes de atualizar
        if (!customerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado para atualização.");
        }
        c.setId(id); // Garante que o ID do path seja usado
        return customerRepository.save(c);
    }

    /** Deleta um cliente. (NOVO: DELETE) */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 (No Content)
    public void delete(@PathVariable Integer id) {
        customerRepository.deleteById(id);
    }


}