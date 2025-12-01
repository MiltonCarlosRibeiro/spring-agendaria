package com.agendaria.agendaria.web.dto;

import lombok.Data;

@Data
public class CustomerDto {

    private Integer id;
    private String name;
    private String phone;
    private String notes;
    private Integer businessId;

}
