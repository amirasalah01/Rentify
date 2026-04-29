package com.rentme.repository;

import com.rentme.model.Message;
import com.rentme.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverOrderByCreatedAtDesc(User receiver);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
    long countByReceiverAndIsRead(User receiver, boolean isRead);
}
