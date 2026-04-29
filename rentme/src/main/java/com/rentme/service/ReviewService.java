package com.rentme.service;

import com.rentme.model.Property;
import com.rentme.model.Review;
import com.rentme.model.User;
import com.rentme.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getByProperty(Property property) {
        return reviewRepository.findByProperty(property);
    }

    public boolean hasReviewed(Property property, User user) {
        return reviewRepository.existsByPropertyAndReviewer(property, user);
    }

    @Transactional
    public Review create(Review review) {
        return reviewRepository.save(review);
    }

    @Transactional
    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }

    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }
}
