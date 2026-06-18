import "./Pages.css";

import { useEffect, useState } from "react";

import { getAlbumData } from "./data/push_supabase.js";
import { formatCardsToPages } from "./data/formatCards.js";

import AlbumPage from "./AlbumPage/AlbumPage.jsx";

function Pages() {
  const [pages, setPages] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbumData() {
      try {
        const { cards, myCards } = await getAlbumData();

        const formattedPages = formatCardsToPages(cards);

        setPages(formattedPages);
        setMyCards(myCards);

        console.log("Cards do banco:", cards);
        console.log("Minhas cartas:", myCards);
        console.log("Páginas formatadas:", formattedPages);
      } catch (error) {
        console.error("Erro ao buscar dados do álbum:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlbumData();
  }, []);

  const stickersQuePossuo = new Set(
    myCards.map((item) => item.card_id)
  );

  if (loading) {
    return (
      <section className="album-gallery-section">
        <h1>Carregando álbum...</h1>
      </section>
    );
  }

  return (
    <>
      {pages.map((page) => (
        <AlbumPage
          key={page.id}
          page={page}
          stickersQuePossuo={stickersQuePossuo}
        />
      ))}
    </>
  );
}

export default Pages;