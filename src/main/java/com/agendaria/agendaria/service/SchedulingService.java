package com.agendaria.agendaria.service;

import com.agendaria.agendaria.domain.enums.AppointmentStatus;
import com.agendaria.agendaria.domain.model.Appointment;
import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.domain.model.Customer;
import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulingService {

    private final AppointmentRepository appointmentRepository;

    private final LocalTime START_OF_DAY = LocalTime.of(9, 0);
    private final LocalTime END_OF_DAY = LocalTime.of(18, 0);
    private final int SLOT_MINUTES = 15;

    public LocalDateTime findNextAvailableSlot(Business business, Procedure procedure) {
        LocalDate date = LocalDate.now();
        for (int dayOffset = 0; dayOffset < 30; dayOffset++) {
            LocalDate currentDate = date.plusDays(dayOffset);
            LocalDateTime slot = findSlotForDate(business, procedure, currentDate);
            if (slot != null) {
                return slot;
            }
        }
        return null;
    }

    private LocalDateTime findSlotForDate(Business business, Procedure procedure, LocalDate date) {

        LocalDateTime from = LocalDateTime.of(date, START_OF_DAY);
        LocalDateTime to = LocalDateTime.of(date, END_OF_DAY);

        List<Appointment> appointments =
                appointmentRepository.findByBusinessAndStartDateTimeBetween(
                        business, from, to);

        int duration = procedure.getDurationMinutes();

        LocalDateTime candidate = from;

        while (!candidate.plusMinutes(duration).isAfter(to)) {

            // variáveis finais para o lambda
            final LocalDateTime candStart = candidate;
            final LocalDateTime candEnd = candidate.plusMinutes(duration);

            boolean overlaps = appointments.stream()
                    .anyMatch(a ->
                            a.getStatus() == AppointmentStatus.BOOKED &&
                                    intervalsOverlap(
                                            candStart,
                                            candEnd,
                                            a.getStartDateTime(),
                                            a.getEndDateTime())
                    );

            if (!overlaps) {
                return candStart;
            }

            candidate = candidate.plusMinutes(SLOT_MINUTES);
        }

        return null;
    }


    private boolean intervalsOverlap(LocalDateTime start1, LocalDateTime end1,
                                     LocalDateTime start2, LocalDateTime end2) {
        return !start1.isAfter(end2) && !start2.isAfter(end1);
    }

    public Appointment scheduleNext(Business business, Customer customer, Procedure procedure) {
        LocalDateTime start = findNextAvailableSlot(business, procedure);
        if (start == null) {
            throw new IllegalStateException("Sem horários disponíveis nos próximos 30 dias");
        }

        LocalDateTime end = start.plusMinutes(procedure.getDurationMinutes());
        Appointment appointment = Appointment.builder()
                .business(business)
                .customer(customer)
                .procedure(procedure)
                .startDateTime(start)
                .endDateTime(end)
                .status(AppointmentStatus.BOOKED)
                .build();

        return appointmentRepository.save(appointment);
    }
}
