package com.agendaria.agendaria.repository;

import com.agendaria.agendaria.domain.enums.AppointmentStatus;
import com.agendaria.agendaria.domain.model.Appointment;
import com.agendaria.agendaria.domain.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByBusinessAndStartDateTimeBetween(
            Business business,
            LocalDateTime from,
            LocalDateTime to
    );

    List<Appointment> findByBusinessAndStartDateTimeAfterOrderByStartDateTimeAsc(
            Business business,
            LocalDateTime after
    );

    List<Appointment> findByStatusAndStartDateTimeAfterOrderByStartDateTimeAsc(
            AppointmentStatus status,
            LocalDateTime after
    );
}
