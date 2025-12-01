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

    private static final LocalTime START_OF_DAY = LocalTime.of(9, 0);
    private static final LocalTime END_OF_DAY   = LocalTime.of(18, 0);
    private static final int SLOT_MINUTES = 15;

    public LocalDateTime findNextAvailableSlot(Business business, Procedure procedure) {

        int duration = procedure.getDurationMinutes();
        LocalDate baseDate = LocalDate.now();

        for (int offset = 0; offset < 30; offset++) {
            LocalDate date = baseDate.plusDays(offset);

            LocalDateTime available = findSlotForDate(business, duration, date);

            if (available != null) {
                return available;
            }
        }

        return null; // sem horário nos próximos 30 dias
    }

    private LocalDateTime findSlotForDate(Business business, int duration, LocalDate date) {

        LocalDateTime from = LocalDateTime.of(date, START_OF_DAY);
        LocalDateTime to   = LocalDateTime.of(date, END_OF_DAY);

        List<Appointment> appointments =
                appointmentRepository.findByBusinessAndStartDateTimeBetween(business, from, to);

        LocalDateTime candidate = from;

        while (!candidate.plusMinutes(duration).isAfter(to)) {

            LocalDateTime candidateEnd = candidate.plusMinutes(duration);

            // cópias efetivamente finais para usar na lambda
            final LocalDateTime slotStart = candidate;
            final LocalDateTime slotEnd   = candidateEnd;

            boolean overlaps = appointments.stream().anyMatch(a ->
                    a.getStatus() == AppointmentStatus.BOOKED
                            && intervalsOverlap(
                            slotStart,
                            slotEnd,
                            a.getStartDateTime(),
                            a.getEndDateTime()
                    )
            );

            if (!overlaps) {
                return candidate;
            }

            candidate = candidate.plusMinutes(SLOT_MINUTES);
        }

        return null;
    }

    private boolean intervalsOverlap(
            LocalDateTime s1, LocalDateTime e1,
            LocalDateTime s2, LocalDateTime e2
    ) {
        return !s1.isAfter(e2) && !s2.isAfter(e1);
    }

    public Appointment scheduleNext(Business business, Customer customer, Procedure procedure) {

        LocalDateTime start = findNextAvailableSlot(business, procedure);

        if (start == null) {
            throw new IllegalStateException("Sem horários disponíveis nos próximos 30 dias.");
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
