package com.rentme.controller;

import com.rentme.model.*;
import com.rentme.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final PropertyService propertyService;
    private final UserService userService;

    @PostMapping("/properties/{id}/reviews")
    public String addReview(@PathVariable Long id,
                            @Valid @ModelAttribute("newReview") Review review,
                            BindingResult result,
                            Principal principal,
                            RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) {
            redirectAttrs.addFlashAttribute("reviewError", "Invalid review data");
            return "redirect:/properties/" + id;
        }
        Property property = propertyService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
        User reviewer = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (reviewService.hasReviewed(property, reviewer)) {
            redirectAttrs.addFlashAttribute("reviewError", "You have already reviewed this property");
            return "redirect:/properties/" + id;
        }
        review.setProperty(property);
        review.setReviewer(reviewer);
        reviewService.create(review);
        redirectAttrs.addFlashAttribute("reviewSuccess", "Review added successfully!");
        return "redirect:/properties/" + id;
    }

    @PostMapping("/reviews/{id}/delete")
    public String deleteReview(@PathVariable Long id, Principal principal) {
        reviewService.findById(id).ifPresent(review -> {
            if (review.getReviewer().getUsername().equals(principal.getName())) {
                Long propertyId = review.getProperty().getId();
                reviewService.delete(id);
            }
        });
        return "redirect:/dashboard";
    }
}
