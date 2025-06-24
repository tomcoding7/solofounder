import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/contexts/AuthContext';
import { User, Momentum, ActionRecord, Achievement } from '@/types/game';

export type UserData = User;

// Database schema type
interface DBUser {
  id: string;
  username: string | null;
  email: string | null;
  xp: number;
  streak: number;
  longest_streak: number;
  last_action_date: string | null;
  momentum: {
    multiplier: number;
    lastActionDate: string;
  };
  actions: ActionRecord[];
  achievements: Achievement[];
}

const defaultUserData: UserData = {
  id: '',
  username: '',
  email: '',
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastActionDate: new Date().toISOString(),
  momentum: {
    multiplier: 1.0,
    lastActionDate: new Date().toISOString()
  },
  actions: [],
  achievements: []
};

export interface ActionMetadata {
  category?: string;
  description?: string;
  [key: string]: any;
}

// Helper function to format database user to our app type
function formatDBUser(dbUser: DBUser): UserData {
  return {
    id: dbUser.id,
    username: dbUser.username || 'Anonymous Founder',
    email: dbUser.email || '',
    xp: dbUser.xp || 0,
    streak: dbUser.streak || 0,
    longestStreak: dbUser.longest_streak || 0,
    lastActionDate: dbUser.last_action_date || new Date().toISOString(),
    momentum: typeof dbUser.momentum === 'string' ? 
      JSON.parse(dbUser.momentum) : 
      dbUser.momentum || {
        multiplier: 1.0,
        lastActionDate: new Date().toISOString()
      },
    actions: typeof dbUser.actions === 'string' ? 
      JSON.parse(dbUser.actions) : 
      dbUser.actions || [],
    achievements: typeof dbUser.achievements === 'string' ? 
      JSON.parse(dbUser.achievements) : 
      dbUser.achievements || []
  };
}

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let mounted = true;

    const fetchUserData = async () => {
      if (!user) {
        console.log("useUserData: No user found, setting default data and loading to false");
        if (mounted) {
          setLoading(false);
          setUserData(defaultUserData);
        }
        return;
      }

      try {
        console.log(`useUserData: Starting fetchUserData for user ID: ${user.id}`);
        setLoading(true);
        setError(null);

        // Try to fetch existing user data
        console.log('useUserData: Attempting to fetch existing user data...');
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('useUserData: Unexpected error fetching user data:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.log('useUserData: No existing user data found. Creating new user profile...');
          // Create a database-compatible user object (excluding actions and achievements)
          const dbUserData = {
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || 'Anonymous Founder',
            xp: 0,
            streak: 0,
            longest_streak: 0,
            last_action_date: new Date().toISOString(),
            momentum: JSON.stringify({
              multiplier: 1.0,
              lastActionDate: new Date().toISOString()
            })
          };

          console.log('useUserData: Attempting to insert new user with data:', dbUserData);
          const { data: insertedData, error: insertError } = await supabase
            .from('users')
            .insert([dbUserData])
            .select()
            .single();

          if (insertError) {
            console.error('useUserData: Error creating user profile:', insertError);
            throw insertError;
          }

          console.log('useUserData: Successfully created new user:', insertedData);
          if (mounted) {
            const formattedData = formatDBUser(insertedData as DBUser);
            console.log('useUserData: Setting formatted user data:', formattedData);
            setUserData(formattedData);
          }
        } else {
          console.log('useUserData: Found existing user data:', data);
          if (mounted) {
            const formattedData = formatDBUser(data as DBUser);
            console.log('useUserData: Setting formatted existing user data:', formattedData);
            setUserData(formattedData);
          }
        }
      } catch (err) {
        console.error('useUserData: Uncaught error in fetchUserData:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user data');
          console.log('useUserData: Setting default data due to error');
          setUserData(defaultUserData);
        }
      } finally {
        if (mounted) {
          console.log('useUserData: Setting loading to false');
          setLoading(false);
        }
      }
    };

    fetchUserData();

    // Set up real-time subscription for user data updates
    const userSubscription = supabase
      .channel(`public:users:id=eq.${user?.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user?.id}`
      }, (payload) => {
        console.log('User data changed:', payload);
        if (mounted && payload.new) {
          const formattedData = formatDBUser(payload.new as DBUser);
          setUserData(formattedData);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      userSubscription.unsubscribe();
    };
  }, [user]);

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!user) return;

    try {
      setError(null);
      // Convert our types to database format
      const dbUpdates = {
        ...updates,
        longest_streak: updates.longestStreak,
        last_action_date: updates.lastActionDate,
        momentum: updates.momentum ? {
          multiplier: updates.momentum.multiplier,
          last_action_date: updates.momentum.lastActionDate
        } : undefined
      };

      const { data, error: updateError } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) {
        setUserData(formatDBUser(data as DBUser));
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user data');
      throw err;
    }
  };

  const recordAction = async (actionId: string, xp: number, multiplier: number = 1.0, metadata: ActionMetadata = {}) => {
    if (!user) return false;

    try {
      setError(null);
      const { error: actionError } = await supabase
        .from('actions')
        .insert([
          {
            user_id: user.id,
            action_id: actionId,
            xp,
            multiplier,
            metadata
          }
        ]);

      if (actionError) throw actionError;
      return true;
    } catch (err) {
      console.error('Error recording action:', err);
      setError(err instanceof Error ? err.message : 'Failed to record action');
      return false;
    }
  };

  return {
    userData,
    loading,
    error,
    updateUserData,
    recordAction
  };
} 