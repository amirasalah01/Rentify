package com.rentme.repository;

import com.rentme.model.Property;
import com.rentme.model.Review;
import com.rentme.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProperty(Property property);
    List<Review> findByReviewer(User reviewer);
    Optional<Review> findByPropertyAndReviewer(Property property, User reviewer);
    boolean existsByPropertyAndReviewer(Property property, User reviewer);
}
