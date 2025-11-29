import { supabase } from "../config/supabaseClient.js";

export const ReviewModel = {
  async addReview(series_id, user_identifier, rating, comment) {
    try {
      console.log('[ReviewModel.addReview] Inserting review:', { series_id, user_identifier, rating, comment });
      
      const { data, error } = await supabase
        .from("reviews")
        .insert({ 
          series_id, 
          user_identifier, 
          rating, 
          comment 
        })
        .select();

      if (error) {
        console.error('[ReviewModel.addReview] Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('[ReviewModel.addReview] Success:', data);
      return data[0];
    } catch (err) {
      console.error('[ReviewModel.addReview] Exception:', err);
      throw err;
    }
  },

  async getSeriesReviews(series_id) {
    try {
      console.log('[ReviewModel.getSeriesReviews] Fetching reviews for series:', series_id);
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("series_id", series_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('[ReviewModel.getSeriesReviews] Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('[ReviewModel.getSeriesReviews] Success, found', data?.length || 0, 'reviews');
      return data;
    } catch (err) {
      console.error('[ReviewModel.getSeriesReviews] Exception:', err);
      throw err;
    }
  }
};
