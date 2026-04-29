package com.rentme.service;

import com.rentme.model.Message;
import com.rentme.model.User;
import com.rentme.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<Message> getInbox(User user) {
        return messageRepository.findByReceiverOrderByCreatedAtDesc(user);
    }

    public List<Message> getSent(User user) {
        return messageRepository.findBySenderOrderByCreatedAtDesc(user);
    }

    public long countUnread(User user) {
        return messageRepository.countByReceiverAndIsRead(user, false);
    }

    @Transactional
    public Message send(Message message) {
        return messageRepository.save(message);
    }

    @Transactional
    public Optional<Message> markRead(Long id) {
        Optional<Message> opt = messageRepository.findById(id);
        opt.ifPresent(m -> {
            m.setRead(true);
            messageRepository.save(m);
        });
        return opt;
    }

    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }
}
