-- Add travel columns to additional_travelers table
ALTER TABLE additional_travelers
ADD COLUMN has_different_travel BOOLEAN DEFAULT false,
ADD COLUMN arrival_date DATE,
ADD COLUMN departure_date DATE,
ADD COLUMN flight_number VARCHAR(50),
ADD COLUMN arrival_time TIME,
ADD COLUMN city_of_arrival VARCHAR(10);