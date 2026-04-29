package com.rentme.controller;

import com.rentme.model.User;
import com.rentme.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final PropertyService propertyService;
    private final FavoriteService favoriteService;
    private final MessageService messageService;

    @GetMapping
    public String dashboard(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        model.addAttribute("user", user);
        model.addAttribute("myProperties", propertyService.getByOwner(user));
        model.addAttribute("favorites", favoriteService.getByUser(user));
        model.addAttribute("recentMessages", messageService.getInbox(user));
        model.addAttribute("unreadCount", messageService.countUnread(user));
        model.addAttribute("favoritesCount", favoriteService.countByUser(user));
        return "dashboard";
    }
}
