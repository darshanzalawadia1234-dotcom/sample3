-- 008_rls_policies.sql: Row Level Security (RLS) policies for user data isolation
-- 1. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Vessels
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public or own vessels"
    ON public.vessels FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert their own vessels"
    ON public.vessels FOR INSERT
    WITH CHECK (auth.uid() IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can update their own vessels"
    ON public.vessels FOR UPDATE
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can delete their own vessels"
    ON public.vessels FOR DELETE
    USING (user_id IS NULL OR user_id = auth.uid());

-- 3. Route Requests & Results
ALTER TABLE public.route_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own route requests"
    ON public.route_requests FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can insert route requests"
    ON public.route_requests FOR INSERT
    WITH CHECK (auth.uid() IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can view route results of their requests"
    ON public.route_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.route_requests r
            WHERE r.id = route_results.route_request_id
            AND (r.user_id IS NULL OR r.user_id = auth.uid())
        )
    );

CREATE POLICY "Allow inserting route results"
    ON public.route_results FOR INSERT
    WITH CHECK (true);

-- 4. Environmental tables (Read-only for public, writes via backend service role)
ALTER TABLE public.sea_ice_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for sea ice observations"
    ON public.sea_ice_observations FOR SELECT USING (true);

ALTER TABLE public.sea_ice_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for sea ice predictions"
    ON public.sea_ice_predictions FOR SELECT USING (true);

ALTER TABLE public.icebergs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for icebergs"
    ON public.icebergs FOR SELECT USING (true);

ALTER TABLE public.iceberg_trajectory_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for iceberg trajectory predictions"
    ON public.iceberg_trajectory_predictions FOR SELECT USING (true);

ALTER TABLE public.weather_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for weather observations"
    ON public.weather_observations FOR SELECT USING (true);

ALTER TABLE public.ocean_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for ocean observations"
    ON public.ocean_observations FOR SELECT USING (true);
