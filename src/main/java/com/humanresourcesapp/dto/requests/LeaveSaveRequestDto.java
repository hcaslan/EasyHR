package com.humanresourcesapp.dto.requests;

import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Builder
public record LeaveSaveRequestDto(
        String description,
        LocalDate startDate,
        LocalDate endDate,
        Long dLeaveTypeId,
        List<MultipartFile> files) {
}
