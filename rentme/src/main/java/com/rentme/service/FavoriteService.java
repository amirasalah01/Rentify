package com.rentme.service;

import com.rentme.model.Favorite;
import com.rentme.model.Property;
import com.rentme.model.User;
import com.rentme.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public List<Favorite> getByUser(User user) {
        return favoriteRepository.findByUser(user);
    }

    public boolean isFavorite(User user, Property property) {
        return favoriteRepository.existsByUserAndProperty(user, property);
    }

    public long countByUser(User user) {
        return favoriteRepository.countByUser(user);
    }

    @Transactional
    public boolean toggle(User user, Property property) {
        Optional<Favorite> existing = favoriteRepository.findByUserAndProperty(user, property);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false;
        } else {
            favoriteRepository.save(Favorite.builder().user(user).property(property).build());
            return true;
        }
    }
}
