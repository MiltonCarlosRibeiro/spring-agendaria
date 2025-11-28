package com.agendaria.agendaria.domain.model;

import com.agendaria.agendaria.domain.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "appointments",
        indexes = {
                @Index(
                        name = "idx_appointment_business_datetime",
                        columnList = "business_id, start_date_time"
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Em SQLite, AUTOINCREMENT é permitido em INTEGER PRIMARY KEY
    // portanto o tipo Java ideal aqui é Integer
    private Integer id;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_id")
    @ToString.Exclude
    private Procedure procedure;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    @ToString.Exclude
    private Business business;

    private String notes;
}
