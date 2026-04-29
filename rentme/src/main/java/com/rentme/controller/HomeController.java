package com.rentme.controller;

import com.rentme.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final PropertyService propertyService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("featuredProperties", propertyService.getFeatured(6));
        return "index";
    }
}
