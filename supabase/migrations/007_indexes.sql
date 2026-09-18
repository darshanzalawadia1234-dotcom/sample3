-- 007_indexes.sql: Spatial GIST indexes and high-frequency B-tree indexes
-- Spatial Indexes (PostGIS GIST)
CREATE INDEX IF NOT EXISTS idx_vessels_location ON public.vessels USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_sea_ice_obs_location ON public.sea_ice_observations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_sea_ice_pred_location ON public.sea_ice_predictions USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_icebergs_location ON public.icebergs USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_iceberg_pred_location ON public.iceberg_trajectory_predictions USING GIST (location);

-- B-tree Indexes for filtering, joins, and sorting
CREATE INDEX IF NOT EXISTS idx_vessels_user_id ON public.vessels (user_id);
CREATE INDEX IF NOT EXISTS idx_vessels_registration_number ON public.vessels (registration_number);
CREATE INDEX IF NOT EXISTS idx_vessels_imo_number ON public.vessels (imo_number);

CREATE INDEX IF NOT EXISTS idx_sea_ice_obs_time ON public.sea_ice_observations (observation_time DESC);
CREATE INDEX IF NOT EXISTS idx_sea_ice_pred_target ON public.sea_ice_predictions (target_time DESC);

CREATE INDEX IF NOT EXISTS idx_icebergs_ext_id ON public.icebergs (external_id);
CREATE INDEX IF NOT EXISTS idx_icebergs_obs_time ON public.icebergs (observation_time DESC);
CREATE INDEX IF NOT EXISTS idx_iceberg_pred_iceberg_id ON public.iceberg_trajectory_predictions (iceberg_id);

CREATE INDEX IF NOT EXISTS idx_weather_obs_time ON public.weather_observations (observation_time DESC);
CREATE INDEX IF NOT EXISTS idx_ocean_obs_time ON public.ocean_observations (observation_time DESC);

CREATE INDEX IF NOT EXISTS idx_route_requests_user ON public.route_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_route_requests_ship ON public.route_requests (ship_id);
CREATE INDEX IF NOT EXISTS idx_route_results_request ON public.route_results (route_request_id);
