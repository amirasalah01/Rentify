package com.rentme.controller;

import com.rentme.model.*;
import com.rentme.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;
    private final PropertyService propertyService;

    @GetMapping
    public String inbox(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        model.addAttribute("messages", messageService.getInbox(user));
        model.addAttribute("unreadCount", messageService.countUnread(user));
        return "messages/inbox";
    }

    @GetMapping("/compose")
    public String composeForm(@RequestParam(required = false) Long propertyId,
                              @RequestParam(required = false) String recipient,
                              Model model) {
        model.addAttribute("message", new Message());
        model.addAttribute("recipientUsername", recipient);
        if (propertyId != null) {
            propertyService.getById(propertyId).ifPresent(p -> model.addAttribute("relatedProperty", p));
            model.addAttribute("relatedPropertyId", propertyId);
        }
        return "messages/compose";
    }

    @PostMapping("/compose")
    public String sendMessage(@RequestParam String recipientUsername,
                              @RequestParam String subject,
                              @RequestParam String body,
                              @RequestParam(required = false) Long relatedPropertyId,
                              Principal principal,
                              RedirectAttributes redirectAttrs) {
        User sender = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userService.findByUsername(recipientUsername)
                .orElseGet(() -> {
                    redirectAttrs.addFlashAttribute("error", "Recipient not found: " + recipientUsername);
                    return null;
                });
        if (receiver == null) {
            return "redirect:/messages/compose";
        }
        Message.MessageBuilder builder = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .subject(subject)
                .body(body);
        if (relatedPropertyId != null) {
            propertyService.getById(relatedPropertyId).ifPresent(builder::relatedProperty);
        }
        messageService.send(builder.build());
        redirectAttrs.addFlashAttribute("success", "Message sent!");
        return "redirect:/messages";
    }

    @GetMapping("/{id}")
    public String viewMessage(@PathVariable Long id, Model model, Principal principal) {
        Message message = messageService.markRead(id)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        User currentUser = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!message.getReceiver().getId().equals(currentUser.getId()) &&
            !message.getSender().getId().equals(currentUser.getId())) {
            return "redirect:/messages";
        }
        model.addAttribute("message", message);
        return "messages/view";
    }
}
