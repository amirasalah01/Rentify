package com.rentme.repository;

import com.rentme.model.Favorite;
import com.rentme.model.Property;
import com.rentme.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndProperty(User user, Property property);
    boolean existsByUserAndProperty(User user, Property property);
    long countByUser(User user);
}
