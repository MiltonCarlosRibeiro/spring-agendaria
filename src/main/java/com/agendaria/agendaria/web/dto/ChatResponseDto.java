package com.agendaria.agendaria.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponseDto {
    private String answer;
}
