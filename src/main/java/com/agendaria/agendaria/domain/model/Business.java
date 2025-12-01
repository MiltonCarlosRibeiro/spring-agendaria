package com.agendaria.agendaria.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "businesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // Agora Integer

    @Column(nullable = false)
    private String name;

    private String slug;

    private String phone;

    @Column(name = "created_at")
    private String createdAt;
}
