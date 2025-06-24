-- Create the actions table to log each action a user takes
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action_id TEXT NOT NULL,
    xp INTEGER NOT NULL,
    multiplier REAL DEFAULT 1.0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own actions" 
    ON public.actions 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions" 
    ON public.actions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS actions_user_id_idx ON public.actions(user_id);
CREATE INDEX IF NOT EXISTS actions_created_at_idx ON public.actions(created_at DESC);

-- Create function to update user XP and other stats after action
CREATE OR REPLACE FUNCTION public.handle_action_xp()
RETURNS TRIGGER AS $$
DECLARE
    earned_xp INTEGER;
BEGIN
    -- Calculate earned XP
    earned_xp := (NEW.xp * NEW.multiplier)::integer;

    -- Update the user's stats
    UPDATE public.users
    SET 
        xp = xp + earned_xp,
        last_action_date = NEW.created_at,
        -- Add the action to the actions array
        actions = COALESCE(actions, '[]'::jsonb) || jsonb_build_object(
            'id', NEW.id,
            'actionId', NEW.action_id,
            'timestamp', NEW.created_at,
            'xp', earned_xp,
            'multiplier', NEW.multiplier
        ),
        -- Update momentum
        momentum = jsonb_build_object(
            'multiplier', LEAST(
                (COALESCE((momentum->>'multiplier')::real, 1.0) + 0.1),
                2.0  -- Cap at 2x
            ),
            'lastActionDate', NEW.created_at
        ),
        updated_at = NEW.created_at
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update user stats
DROP TRIGGER IF EXISTS on_action_created ON public.actions;
CREATE TRIGGER on_action_created
    AFTER INSERT ON public.actions
    FOR EACH ROW EXECUTE FUNCTION public.handle_action_xp(); 