package com.humanresourcesapp.controllers;


import com.humanresourcesapp.dto.requests.CompanyItemSaveRequestDto;
import com.humanresourcesapp.dto.requests.PageRequestDto;
import com.humanresourcesapp.entities.CompanyItem;
import com.humanresourcesapp.services.CompanyItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import static com.humanresourcesapp.constants.Endpoints.*;
@RestController
@RequestMapping(ROOT + COMPANY_ITEM)
@RequiredArgsConstructor
@CrossOrigin("*")
public class CompanyItemController {

    private final CompanyItemService companyItemService;

    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public ResponseEntity<CompanyItem> save(@RequestBody CompanyItemSaveRequestDto dto) {
        return ResponseEntity.ok(companyItemService.save(dto));
    }


    @PostMapping(GET_ALL)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public List<CompanyItem> findAll(@RequestBody PageRequestDto dto) {
        return companyItemService.findAllBySerialNumber(dto);
    }

    @PostMapping(GET_TYPES)
    @PreAuthorize("hasAnyAuthority('MANAGER')")
    public List<String> getTypes() {
        return companyItemService.getCompanyItemTypes();
    }

}
