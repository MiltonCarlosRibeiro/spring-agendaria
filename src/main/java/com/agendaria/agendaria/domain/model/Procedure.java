package com.agendaria.agendaria.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "procedures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Procedure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    @ToString.Exclude
    private Business business;
}
