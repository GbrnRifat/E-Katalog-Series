import { supabase } from "../config/supabaseClient.js";

export const FavoriteModel = {
  async addFavorite(user_identifier, series_id) {
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_identifier, series_id })
      .select();

    if (error) throw error;
    return data[0];
  },

  async getUserFavorites(user_identifier) {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_identifier", user_identifier);

    if (error) throw error;
    return data;
  },

  async removeFavorite(user_identifier, series_id) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_identifier", user_identifier)
      .eq("series_id", series_id);

    if (error) throw error;
    return true;
  }
};
