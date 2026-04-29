package com.rentme.service;

import com.rentme.model.Property;
import com.rentme.model.PropertyType;
import com.rentme.model.User;
import com.rentme.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    public List<Property> getAvailable() {
        return propertyRepository.findByIsAvailable(true);
    }

    @Transactional
    public Optional<Property> getById(Long id) {
        Optional<Property> opt = propertyRepository.findById(id);
        opt.ifPresent(p -> {
            p.setViewCount(p.getViewCount() + 1);
            propertyRepository.save(p);
        });
        return opt;
    }

    @Transactional
    public Property create(Property property) {
        return propertyRepository.save(property);
    }

    @Transactional
    public Property update(Property property) {
        return propertyRepository.save(property);
    }

    @Transactional
    public void delete(Long id) {
        propertyRepository.deleteById(id);
    }

    public List<Property> search(String keyword, String city, PropertyType type,
                                 BigDecimal minPrice, BigDecimal maxPrice) {
        return propertyRepository.search(keyword, city, type, minPrice, maxPrice);
    }

    public List<Property> getByOwner(User owner) {
        return propertyRepository.findByOwner(owner);
    }

    public List<Property> getFeatured(int limit) {
        List<Property> all = propertyRepository.findByIsAvailable(true);
        return all.stream().limit(limit).toList();
    }
}
