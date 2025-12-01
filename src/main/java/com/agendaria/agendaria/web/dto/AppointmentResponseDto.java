package com.agendaria.agendaria.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {

    private Integer id;
    private String customerName;
    private String procedureName;
    private String startDateTime;
    private String endDateTime;
    private String status;
}
