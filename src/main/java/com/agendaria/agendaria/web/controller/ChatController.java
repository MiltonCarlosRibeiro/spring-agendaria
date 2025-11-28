package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.domain.model.Customer;
import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.BusinessRepository;
import com.agendaria.agendaria.repository.CustomerRepository;
import com.agendaria.agendaria.repository.ProcedureRepository;
import com.agendaria.agendaria.service.SchedulingService;
import com.agendaria.agendaria.web.dto.ChatAskDto;
import com.agendaria.agendaria.web.dto.ChatResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final BusinessRepository businessRepository;
    private final ProcedureRepository procedureRepository;
    private final CustomerRepository customerRepository;
    private final SchedulingService schedulingService;

    private Business getDefaultBusiness() {
        return businessRepository.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Business padrão não encontrado (id=1)"));
    }

    @PostMapping("/ask")
    public ChatResponseDto ask(@RequestBody ChatAskDto dto) {
        String msg = Optional.ofNullable(dto.getMessage()).orElse("").trim();
        if (!StringUtils.hasText(msg)) {
            return ChatResponseDto.builder()
                    .answer("Envie uma mensagem com o procedimento desejado, por exemplo: 'Teria horário para sobrancelha?'")
                    .build();
        }

        String lower = msg.toLowerCase(Locale.ROOT);

        var procedures = procedureRepository.findByActiveTrue();
        if (procedures.isEmpty()) {
            return ChatResponseDto.builder()
                    .answer("Ainda não há procedimentos cadastrados. Cadastre ao menos um procedimento na tela de Procedimentos.")
                    .build();
        }

        Procedure matched = procedures.stream()
                .filter(p -> lower.contains(p.getName().toLowerCase(Locale.ROOT)))
                .findFirst()
                .orElse(procedures.get(0));

        Business business = getDefaultBusiness();

        Customer tempCustomer = Customer.builder()
                .name("Cliente WhatsApp")
                .phone("whats-temp")
                .business(business)
                .build();
        tempCustomer = customerRepository.save(tempCustomer);

        var appt = schedulingService.scheduleNext(business, tempCustomer, matched);

        String when = appt.getStartDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        String answer = "Encontrei o próximo horário disponível para " + matched.getName()
                + ": " + when + ". Confirme aqui na agenda para finalizar com o cliente.";

        return ChatResponseDto.builder()
                .answer(answer)
                .build();
    }
}
