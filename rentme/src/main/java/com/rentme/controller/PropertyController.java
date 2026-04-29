package com.rentme.controller;

import com.rentme.model.*;
import com.rentme.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final UserService userService;
    private final ReviewService reviewService;
    private final FavoriteService favoriteService;

    @GetMapping
    public String list(@RequestParam(required = false) String keyword,
                       @RequestParam(required = false) String city,
                       @RequestParam(required = false) PropertyType type,
                       @RequestParam(required = false) BigDecimal minPrice,
                       @RequestParam(required = false) BigDecimal maxPrice,
                       Model model) {
        List<Property> properties;
        if (keyword != null || city != null || type != null || minPrice != null || maxPrice != null) {
            properties = propertyService.search(keyword, city, type, minPrice, maxPrice);
        } else {
            properties = propertyService.getAvailable();
        }
        model.addAttribute("properties", properties);
        model.addAttribute("propertyTypes", PropertyType.values());
        model.addAttribute("keyword", keyword);
        model.addAttribute("city", city);
        model.addAttribute("type", type);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);
        return "property/list";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model, Principal principal) {
        Property property = propertyService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found: " + id));
        List<Review> reviews = reviewService.getByProperty(property);

        model.addAttribute("property", property);
        model.addAttribute("reviews", reviews);

        if (principal != null) {
            User currentUser = userService.findByUsername(principal.getName()).orElse(null);
            if (currentUser != null) {
                model.addAttribute("isFavorite", favoriteService.isFavorite(currentUser, property));
                model.addAttribute("hasReviewed", reviewService.hasReviewed(property, currentUser));
                model.addAttribute("currentUser", currentUser);
            }
            model.addAttribute("newReview", new Review());
        }
        return "property/detail";
    }

    @GetMapping("/new")
    public String newPropertyForm(Model model, Principal principal) {
        User owner = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!owner.isPropertyOwner()) {
            return "redirect:/?error=notOwner";
        }
        model.addAttribute("property", new Property());
        model.addAttribute("propertyTypes", PropertyType.values());
        model.addAttribute("formAction", "/properties/new");
        return "property/form";
    }

    @PostMapping("/new")
    public String createProperty(@Valid @ModelAttribute("property") Property property,
                                 BindingResult result,
                                 Principal principal,
                                 Model model) {
        if (result.hasErrors()) {
            model.addAttribute("propertyTypes", PropertyType.values());
            model.addAttribute("formAction", "/properties/new");
            return "property/form";
        }
        User owner = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        property.setOwner(owner);
        propertyService.create(property);
        return "redirect:/dashboard";
    }

    @GetMapping("/{id}/edit")
    public String editPropertyForm(@PathVariable Long id, Model model, Principal principal) {
        Property property = propertyService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
        User owner = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!property.getOwner().getId().equals(owner.getId())) {
            return "redirect:/properties/" + id;
        }
        model.addAttribute("property", property);
        model.addAttribute("propertyTypes", PropertyType.values());
        model.addAttribute("formAction", "/properties/" + id + "/edit");
        return "property/form";
    }

    @PostMapping("/{id}/edit")
    public String updateProperty(@PathVariable Long id,
                                 @Valid @ModelAttribute("property") Property property,
                                 BindingResult result,
                                 Principal principal,
                                 Model model) {
        if (result.hasErrors()) {
            model.addAttribute("propertyTypes", PropertyType.values());
            model.addAttribute("formAction", "/properties/" + id + "/edit");
            return "property/form";
        }
        Property existing = propertyService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
        User owner = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!existing.getOwner().getId().equals(owner.getId())) {
            return "redirect:/properties/" + id;
        }
        property.setId(id);
        property.setOwner(owner);
        property.setViewCount(existing.getViewCount());
        property.setCreatedAt(existing.getCreatedAt());
        propertyService.update(property);
        return "redirect:/properties/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deleteProperty(@PathVariable Long id, Principal principal) {
        Property existing = propertyService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
        User owner = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (existing.getOwner().getId().equals(owner.getId())) {
            propertyService.delete(id);
        }
        return "redirect:/dashboard";
    }
}
