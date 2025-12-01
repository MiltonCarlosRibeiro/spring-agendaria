package com.agendaria.agendaria.service;

import com.agendaria.agendaria.domain.enums.AppointmentStatus;
import com.agendaria.agendaria.domain.model.Appointment;
import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SchedulingService schedulingService;

    @Transactional
    public Appointment cancel(Integer id, String reason) {

        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado"));

        appt.setStatus(AppointmentStatus.CANCELLED);

        String note = appt.getNotes() == null ? "" : appt.getNotes() + " | ";
        appt.setNotes(note + "Cancelado: " + reason);

        return appt;
    }

    @Transactional
    public Appointment rescheduleNext(Integer id) {

        Appointment old = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado"));

        old.setStatus(AppointmentStatus.CANCELLED);

        String note = old.getNotes() == null ? "" : old.getNotes() + " | ";
        old.setNotes(note + "Reagendado (automático)");

        return schedulingService.scheduleNext(old.getBusiness(), old.getCustomer(), old.getProcedure());
    }

    public List<Appointment> listNextAppointments(Business business) {
        return appointmentRepository.findByBusinessAndStartDateTimeAfterOrderByStartDateTimeAsc(
                business,
                LocalDateTime.now()
        );
    }
}
