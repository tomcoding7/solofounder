import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User as GameUser } from '@/types/game';
import { getDefaultUser } from '@/utils/game';

export const useUserData = () => {
  const { user } = useAuth();
  const [gameUser, setGameUser] = useState<GameUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setGameUser(null);
        setLoading(false);
        return;
      }

      try {
        // Try to fetch existing user data
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !userData) {
          // Create new user if not found
          const defaultUser = getDefaultUser();
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                ...defaultUser,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setGameUser(newUser as unknown as GameUser);
        } else {
          setGameUser(userData as unknown as GameUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const updateUserData = async (updates: Partial<GameUser>) => {
    if (!user || !gameUser) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGameUser(data as unknown as GameUser);
      return data;
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  };

  const recordAction = async (actionId: string, xp: number, multiplier: number) => {
    if (!user || !gameUser) return;

    try {
      // Record the action
      const { error: actionError } = await supabase
        .from('actions')
        .insert([
          {
            user_id: user.id,
            action_id: actionId,
            xp,
            multiplier,
          },
        ]);

      if (actionError) throw actionError;

      // Update user XP
      const updates = {
        xp: gameUser.xp + xp,
        last_action_date: new Date().toISOString(),
      };

      const updatedUser = await updateUserData(updates);
      return updatedUser;
    } catch (error) {
      console.error('Error recording action:', error);
      return null;
    }
  };

  return {
    gameUser,
    loading,
    updateUserData,
    recordAction,
  };
}; 