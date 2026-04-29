package com.rentme;

import com.rentme.model.*;
import com.rentme.repository.*;
import com.rentme.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(1)
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User alice = userRepository.save(User.builder()
                .username("alice")
                .email("alice@example.com")
                .password(passwordEncoder.encode("password"))
                .phone("555-0101")
                .bio("Property owner with multiple listings in downtown.")
                .isPropertyOwner(true)
                .isVerified(true)
                .build());

        User bob = userRepository.save(User.builder()
                .username("bob")
                .email("bob@example.com")
                .password(passwordEncoder.encode("password"))
                .phone("555-0102")
                .bio("Looking for a nice apartment in the city.")
                .isPropertyOwner(false)
                .isVerified(true)
                .build());

        User carol = userRepository.save(User.builder()
                .username("carol")
                .email("carol@example.com")
                .password(passwordEncoder.encode("password"))
                .phone("555-0103")
                .bio("Real estate investor with homes across the country.")
                .isPropertyOwner(true)
                .isVerified(true)
                .build());

        propertyRepository.save(Property.builder()
                .title("Modern Downtown Apartment")
                .description("A beautiful modern apartment in the heart of the city, close to all amenities.")
                .address("123 Main St, Apt 4B")
                .city("New York")
                .country("USA")
                .bedrooms(2)
                .bathrooms(1)
                .squareFeet(850)
                .propertyType(PropertyType.APARTMENT)
                .pricePerMonth(new BigDecimal("2800.00"))
                .availableFrom(LocalDate.now())
                .isAvailable(true)
                .owner(alice)
                .build());

        propertyRepository.save(Property.builder()
                .title("Cozy Studio in Brooklyn")
                .description("A charming studio apartment with exposed brick walls and natural light.")
                .address("45 Park Ave")
                .city("New York")
                .country("USA")
                .bedrooms(0)
                .bathrooms(1)
                .squareFeet(450)
                .propertyType(PropertyType.STUDIO)
                .pricePerMonth(new BigDecimal("1600.00"))
                .availableFrom(LocalDate.now().plusDays(7))
                .isAvailable(true)
                .owner(alice)
                .build());

        propertyRepository.save(Property.builder()
                .title("Spacious Family House")
                .description("A large family home with a beautiful garden and garage.")
                .address("789 Oak Lane")
                .city("Austin")
                .country("USA")
                .bedrooms(4)
                .bathrooms(3)
                .squareFeet(2400)
                .propertyType(PropertyType.HOUSE)
                .pricePerMonth(new BigDecimal("3200.00"))
                .availableFrom(LocalDate.now().plusDays(14))
                .isAvailable(true)
                .owner(carol)
                .build());

        propertyRepository.save(Property.builder()
                .title("Luxury Condo with City Views")
                .description("High-floor condo with panoramic city views and premium finishes.")
                .address("100 Skyline Blvd, Unit 2201")
                .city("Chicago")
                .country("USA")
                .bedrooms(3)
                .bathrooms(2)
                .squareFeet(1800)
                .propertyType(PropertyType.CONDO)
                .pricePerMonth(new BigDecimal("4500.00"))
                .availableFrom(LocalDate.now())
                .isAvailable(true)
                .owner(carol)
                .build());

        propertyRepository.save(Property.builder()
                .title("Charming Beach Villa")
                .description("Stunning villa just steps from the beach, perfect for relaxation.")
                .address("22 Oceanfront Dr")
                .city("Miami")
                .country("USA")
                .bedrooms(5)
                .bathrooms(4)
                .squareFeet(3200)
                .propertyType(PropertyType.VILLA)
                .pricePerMonth(new BigDecimal("8000.00"))
                .availableFrom(LocalDate.now().plusMonths(1))
                .isAvailable(true)
                .owner(carol)
                .build());

        propertyRepository.save(Property.builder()
                .title("Trendy Loft in SoHo")
                .description("Stylish open-plan loft in the vibrant SoHo neighborhood.")
                .address("56 Spring St, Floor 3")
                .city("New York")
                .country("USA")
                .bedrooms(1)
                .bathrooms(1)
                .squareFeet(1100)
                .propertyType(PropertyType.APARTMENT)
                .pricePerMonth(new BigDecimal("3500.00"))
                .availableFrom(LocalDate.now())
                .isAvailable(true)
                .owner(alice)
                .build());
    }
}
