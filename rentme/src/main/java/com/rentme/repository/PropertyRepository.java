package com.rentme.repository;

import com.rentme.model.Property;
import com.rentme.model.PropertyType;
import com.rentme.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByIsAvailable(boolean available);
    List<Property> findByCityContainingIgnoreCase(String city);
    List<Property> findByPropertyType(PropertyType type);
    List<Property> findByOwner(User owner);

    @Query("SELECT p FROM Property p WHERE " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:type IS NULL OR p.propertyType = :type) " +
           "AND (:minPrice IS NULL OR p.pricePerMonth >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.pricePerMonth <= :maxPrice) " +
           "AND p.isAvailable = true " +
           "ORDER BY p.createdAt DESC")
    List<Property> search(@Param("keyword") String keyword,
                          @Param("city") String city,
                          @Param("type") PropertyType type,
                          @Param("minPrice") BigDecimal minPrice,
                          @Param("maxPrice") BigDecimal maxPrice);
}
