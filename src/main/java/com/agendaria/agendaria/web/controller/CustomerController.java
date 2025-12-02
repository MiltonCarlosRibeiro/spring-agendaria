// src/main/java/com/agendaria/agendaria/web/controller/CustomerController.java
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
        // Assume que o ID é nulo ou 0 para criação
        return customerRepository.save(c);
    }

    // --- NOVO: PUT (Atualizar) ---
    @PutMapping("/{id}")
    public Customer update(@PathVariable Integer id, @RequestBody Customer c) {
        if (!customerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado para atualização.");
        }
        c.setId(id); // Garante que o ID do caminho seja usado
        return customerRepository.save(c);
    }

    // --- NOVO: DELETE (Deletar) ---
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 (No Content) em caso de sucesso
    public void delete(@PathVariable Integer id) {
        // Lida com a exceção se o cliente tiver agendamentos vinculados (depende da configuração do banco, mas a deleção simples funciona se não houver FK)
        customerRepository.deleteById(id);
    }
}