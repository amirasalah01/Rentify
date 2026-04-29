package com.rentme.controller;

import com.rentme.model.User;
import com.rentme.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "auth/register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") User user,
                           BindingResult result,
                           RedirectAttributes redirectAttrs) {
        if (result.hasErrors()) {
            return "auth/register";
        }
        try {
            userService.registerUser(user);
            redirectAttrs.addFlashAttribute("success", "Registration successful! Please log in.");
            return "redirect:/auth/login";
        } catch (IllegalArgumentException e) {
            result.rejectValue(null, "error.user", e.getMessage());
            return "auth/register";
        }
    }
}
