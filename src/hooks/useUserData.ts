import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/contexts/AuthContext';

export interface UserData {
  id: string;
  username: string | null;
  email: string | null;
  xp: number;
  level: number;
  stats: Record<string, any>;
  momentum: number;
  achievements: any[];
  questProgress: Record<string, any>;
  streakData: {
    current: number;
    longest: number;
    lastCheckin: string | null;
  };
}

const defaultUserData: UserData = {
  id: '',
  username: null,
  email: null,
  xp: 0,
  level: 1,
  stats: {},
  momentum: 0,
  achievements: [],
  questProgress: {},
  streakData: {
    current: 0,
    longest: 0,
    lastCheckin: null
  }
};

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
        if (mounted) {
          setLoading(false);
          setUserData(defaultUserData);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to fetch existing user data
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching user data:', fetchError);
          throw fetchError;
        }

        if (!data) {
          // If no data exists, create a new user profile
          const newUserData = {
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || null,
            xp: 0,
            level: 1,
            stats: {},
            momentum: 0,
            achievements: [],
            questProgress: {},
            streakData: {
              current: 0,
              longest: 0,
              lastCheckin: null
            }
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('users')
            .insert([newUserData])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            throw insertError;
          }

          if (mounted) {
            setUserData(insertedData as UserData);
          }
        } else {
          if (mounted) {
            setUserData(data as UserData);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user data');
          // Still set default data so the app can function
          setUserData(defaultUserData);
        }
      } finally {
        if (mounted) {
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
          setUserData(payload.new as UserData);
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
      const { data, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) {
        setUserData(data as UserData);
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user data');
      throw err;
    }
  };

  return { userData, loading, error, updateUserData };
} 