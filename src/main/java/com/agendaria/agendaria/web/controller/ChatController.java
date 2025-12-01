package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.web.dto.ChatAskDto;
import com.agendaria.agendaria.web.dto.ChatResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @PostMapping("/ask")
    public ChatResponseDto ask(@RequestBody ChatAskDto dto) {

        return ChatResponseDto.builder()
                .answer("Mensagem recebida: " + dto.getMessage())
                .build();
    }
}
