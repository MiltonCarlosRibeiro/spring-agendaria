package com.agendaria.agendaria.web.dto;

import lombok.Data;

@Data
public class ProcedureDto {

    private Integer id;
    private String name;
    private Integer durationMinutes;
    private Double price;
    private Boolean active;
    private Integer businessId;

}
