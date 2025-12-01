package com.agendaria.agendaria.web.controller;

import com.agendaria.agendaria.domain.model.Appointment;
import com.agendaria.agendaria.domain.model.Business;
import com.agendaria.agendaria.domain.model.Customer;
import com.agendaria.agendaria.domain.model.Procedure;
import com.agendaria.agendaria.repository.BusinessRepository;
import com.agendaria.agendaria.repository.CustomerRepository;
import com.agendaria.agendaria.repository.ProcedureRepository;
import com.agendaria.agendaria.service.AppointmentService;
import com.agendaria.agendaria.service.SchedulingService;
import com.agendaria.agendaria.web.dto.AppointmentRequestDto;
import com.agendaria.agendaria.web.dto.AppointmentResponseDto;
import com.agendaria.agendaria.web.dto.CancelRescheduleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final ProcedureRepository procedureRepository;
    private final SchedulingService schedulingService;
    private final AppointmentService appointmentService;

    private final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private Business getDefaultBusiness() {
        return businessRepository.findById(1)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Business padrão não encontrado (id=1)"
                ));
    }

    /** Agendar próximo horário disponível */
    @PostMapping("/next")
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponseDto scheduleNext(@RequestBody AppointmentRequestDto dto) {

        Business business = getDefaultBusiness();

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado"));

        Procedure procedure = procedureRepository.findById(dto.getProcedureId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Procedimento não encontrado"));

        Appointment appointment = schedulingService.scheduleNext(
                business, customer, procedure
        );

        return toDto(appointment);
    }

    /** Cancelar */
    @PostMapping("/{id}/cancel")
    public AppointmentResponseDto cancel(@PathVariable Integer id,
                                         @RequestBody CancelRescheduleDto dto) {

        Appointment appt = appointmentService.cancel(id, dto.getReason());
        return toDto(appt);
    }

    /** Reagendar automaticamente para o próximo horário */
    @PostMapping("/{id}/reschedule-next")
    public AppointmentResponseDto rescheduleNext(@PathVariable Integer id) {

        Appointment newAppt = appointmentService.rescheduleNext(id);
        return toDto(newAppt);
    }

    /** Lista todos os próximos agendamentos */
    @GetMapping("/next-list")
    public List<AppointmentResponseDto> listNext() {

        Business business = getDefaultBusiness();

        return appointmentService.listNextAppointments(business)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private AppointmentResponseDto toDto(Appointment a) {
        return AppointmentResponseDto.builder()
                .id(a.getId())
                .customerName(a.getCustomer() != null ? a.getCustomer().getName() : "")
                .procedureName(a.getProcedure() != null ? a.getProcedure().getName() : "")
                .startDateTime(a.getStartDateTime().format(ISO))
                .endDateTime(a.getEndDateTime().format(ISO))
                .status(a.getStatus().name())
                .build();
    }
}
