package com.agendaria.agendaria.web.dto;

import lombok.Data;

@Data
public class AppointmentRequestDto {
    private Integer customerId;
    private Integer procedureId;
}
