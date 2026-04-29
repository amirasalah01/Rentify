package com.rentme.controller;

import com.rentme.model.*;
import com.rentme.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final PropertyService propertyService;
    private final UserService userService;

    @PostMapping("/toggle/{propertyId}")
    public String toggle(@PathVariable Long propertyId,
                         Principal principal,
                         RedirectAttributes redirectAttrs) {
        Property property = propertyService.getById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean added = favoriteService.toggle(user, property);
        redirectAttrs.addFlashAttribute("favoriteMsg",
                added ? "Added to favorites!" : "Removed from favorites.");
        return "redirect:/properties/" + propertyId;
    }
}
