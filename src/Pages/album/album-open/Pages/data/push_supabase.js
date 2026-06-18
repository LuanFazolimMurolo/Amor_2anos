import { supabase } from "../../../../../lib/supabaseClient";

export async function getAlbumData() {
  const { data: cards, error: cardsError } = await supabase
    .from("album_cards")
    .select("*")
    .order("id", { ascending: true });
  
  if (cardsError) throw cardsError;

  const { data: myCards, error: myCardsError } = await supabase
    .from("album_my_cards")
    .select("*");

  if (myCardsError) throw myCardsError;
  return {
    cards,
    myCards,
  };
}