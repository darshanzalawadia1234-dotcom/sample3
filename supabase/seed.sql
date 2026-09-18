-- seed.sql: Baseline initial data for Antarctic vessels, icebergs, and observations
INSERT INTO public.vessels (
    vessel_name, registration_number, imo_number, call_sign, vessel_type, owner_name,
    latitude, longitude, destination_latitude, destination_longitude, destination,
    max_speed, normal_speed, fuel_consumption_rate, fuel_capacity, ice_class, status
) VALUES
(
    'RRS Sir David Attenborough', 'UK-POLAR-01', '9798222', 'ZDLP7', 'Polar Research Vessel', 'British Antarctic Survey',
    -64.82, -58.25, -67.57, -68.13, 'Rothera Research Station',
    17.5, 13.0, 78.0, 1150000.0, 'PC4', 'OPERATIONAL'
),
(
    'RV Polarstern', 'GER-POLAR-02', '8013132', 'DBLK', 'Icebreaker & Research Vessel', 'Alfred Wegener Institute',
    -70.50, -45.00, -75.00, -26.00, 'Neumayer Station III',
    16.0, 11.5, 92.0, 1400000.0, 'PC3', 'OPERATIONAL'
),
(
    'RV Nathaniel B. Palmer', 'USA-POLAR-03', '9007295', 'WBP3210', 'Antarctic Research Vessel', 'National Science Foundation',
    -63.50, -60.00, -64.77, -64.05, 'Palmer Station',
    15.0, 11.0, 84.0, 980000.0, 'PC5', 'OPERATIONAL'
)
ON CONFLICT DO NOTHING;

-- Monitored Icebergs
INSERT INTO public.icebergs (
    external_id, latitude, longitude, observation_time, length, width, height, speed, direction, source
) VALUES
('A-68A', -63.15, -56.80, NOW(), 1200.0, 600.0, 48.0, 1.4, 45.0, 'BYU_NIC_TRACKING'),
('A-74', -71.20, -25.50, NOW(), 850.0, 420.0, 35.0, 0.9, 120.0, 'BYU_NIC_TRACKING'),
('B-15J', -66.80, 140.20, NOW(), 650.0, 310.0, 28.0, 1.1, 210.0, 'BYU_NIC_TRACKING'),
('C-19C', -72.00, 172.50, NOW(), 450.0, 200.0, 22.0, 0.7, 315.0, 'BYU_NIC_TRACKING')
ON CONFLICT (external_id) DO NOTHING;

-- Initial Sea Ice Observations
INSERT INTO public.sea_ice_observations (
    latitude, longitude, observation_time, ice_concentration, ice_extent, surface_temperature, source
) VALUES
(-70.5, -45.0, NOW(), 88.5, 185000.0, -14.2, 'DEMO_SYNTHETIC'),
(-75.0, 175.0, NOW(), 82.1, 142000.0, -16.5, 'DEMO_SYNTHETIC'),
(-63.2, -58.0, NOW(), 62.4, 98000.0, -4.8, 'DEMO_SYNTHETIC'),
(-68.0, -85.0, NOW(), 46.8, 67000.0, -6.1, 'DEMO_SYNTHETIC'),
(-72.5, -110.0, NOW(), 28.3, 31000.0, -2.4, 'DEMO_SYNTHETIC'),
(-68.2, 75.0, NOW(), 74.0, 112000.0, -11.0, 'DEMO_SYNTHETIC');

-- Initial Weather & Ocean
INSERT INTO public.weather_observations (latitude, longitude, temperature, wind_speed, wind_direction, pressure, precipitation, wave_height)
VALUES (-64.82, -58.25, -7.4, 26.5, 215.0, 982.0, 0.2, 2.8);

INSERT INTO public.ocean_observations (latitude, longitude, water_temperature, current_speed, current_direction, wave_height)
VALUES (-64.82, -58.25, -1.2, 1.4, 195.0, 2.8);
