package com.agendaria.agendaria.web.dto;

import lombok.Data;

@Data
public class AppointmentRequestDto {
    private Long customerId;
    private Long procedureId;
}
