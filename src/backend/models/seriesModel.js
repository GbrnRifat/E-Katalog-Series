import { supabase } from "../config/supabaseClient.js";

export const SeriesModel = {
  async getAll() {
    const { data, error } = await supabase.from("series").select("*");

    if (error) throw error;
    return data || [];
  },

  async create(seriesData) {
    try {
      console.log('[SeriesModel.create] Inserting:', seriesData);
      
      const { data, error } = await supabase.from("series").insert(seriesData).select();

      if (error) {
        console.error('[SeriesModel.create] Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert');
      }

      const created = data[0];
      console.log('[SeriesModel.create] Success:', created);
      return created;
    } catch (err) {
      console.error('[SeriesModel.create] Exception:', err);
      throw err;
    }
  },

  async getById(id) {
    const { data, error } = await supabase.from("series").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async update(id, seriesData) {
    const { data, error } = await supabase.from("series").update(seriesData).eq("id", id).select();

    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { data, error } = await supabase.from("series").delete().eq("id", id).select();

    if (error) throw error;
    return data;
  },

  async search(query) {
    const { data, error } = await supabase.from("series").select("*").ilike("title", `%${query}%`);

    if (error) throw error;
    return data || [];
  }
};
