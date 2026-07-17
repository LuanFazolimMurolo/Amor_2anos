import "./Pages.css";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAlbumData } from "./data/push_supabase.js";
import { formatCardsToPages } from "./data/formatCards.js";
import { getPageThemeClass } from "./utils/getPageThemeClass.js";
import AlbumPage from "./AlbumPage/AlbumPage.jsx";

function Pages({ reloadKey = 0, galleryRef, albumOpen }) {
  const [pages, setPages] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePageId, setActivePageId] = useState(null);
  // ======================================================
  // SCROLL LIVRE EM CIMA DO MINIMAPA 
  //
  // -Quando o mouse está em cima da barrinha
  // -O scroll é transferido para o container do álbum
  // -Se o scroll for forte, ele pula várias páginas
  // -Funciona mais parecido com scroll normal
  // ======================================================
  function handleShortcutsWheel(event) {
    event.preventDefault();
    event.stopPropagation();

    const galleryElement = galleryRef?.current;

    if (!galleryElement) {
      return;
    }

    // ======================================================
    // SENSIBILIDADE DO SCROLL
    //
    // 1   = normal
    // 1.5 = mais rápido
    // 2   = bem rápido
    //
    // Se estiver pulando demais, diminui.
    // Se estiver lento, aumenta.
    // ======================================================
    const scrollMultiplier = 1.8;

    galleryElement.scrollBy({
      top: event.deltaY * scrollMultiplier,
      left: 0,
      behavior: "auto",
    });
  }
  // ======================================================
  // REFS DAS PÁGINAS
  //
  // -Guarda cada página pelo id
  // -Permite clicar no atalho e ir direto para ela
  // ======================================================
  const pageRefs = useRef({});

  useEffect(() => {
    async function loadAlbumData() {
      try {
        setLoading(true);

        const { cards, myCards } = await getAlbumData();

        const formattedPages = formatCardsToPages(cards);

        console.table(
          formattedPages.map((page, index) => {
            return {
              screenIndex: index + 1,
              pageId: page.id,
              month: page.month,
              age: page.age,
              orderIndex: page.orderIndex,
              theme: page.theme,
              layout: page.layout,
              totalStickers: page.stickers.length,
            };
          })
        );

        setPages(formattedPages);
        setMyCards(myCards);
      } catch (error) {
        console.error("Erro ao buscar dados do álbum:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlbumData();
  }, [reloadKey]);

  // ======================================================
  // DETECTANDO QUAL PÁGINA ESTÁ VISÍVEL
  //
  // -Serve para marcar o botão ativo na lateral
  // ======================================================
  useEffect(() => {
    if (pages.length === 0) {
      return;
    }

    const rootElement = galleryRef?.current || null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => {
            return entryB.intersectionRatio - entryA.intersectionRatio;
          });

        const mostVisibleEntry = visibleEntries[0];

        if (!mostVisibleEntry) {
          return;
        }

        const pageId = mostVisibleEntry.target.dataset.pageId;

        setActivePageId(pageId);
      },
      {
        root: rootElement,
        threshold: [0.45, 0.55, 0.65, 0.75],
      }
    );

    pages.forEach((page, index) => {
      const element = pageRefs.current[page.id];

      if (!element) {
        return;
      }

      element.dataset.pageId = page.id;
      element.dataset.screenIndex = String(index + 1);
      element.dataset.orderIndex = String(page.orderIndex ?? 999);
      element.dataset.month = page.month;

      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [pages, galleryRef]);

  // ======================================================
  // INDO DIRETO PARA UMA PÁGINA
  //
  // -Ao clicar no botão lateral
  // -Rola direto até a página escolhida
  // ======================================================
  function scrollToPage(pageId) {
    const pageElement = pageRefs.current[pageId];

    if (!pageElement) {
      return;
    }

    pageElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function getPageButtonLabel(page) {
    if (page.age) {
      return `${page.month} ${page.age}`;
    }

    return page.month;
  }

  const stickersQuePossuo = new Set(
    myCards.map((item) => item.card_id)
  );

  if (loading && !reloadKey) {
    return (
      <section className="album-gallery-section">
        <h1>Carregando álbum...</h1>
      </section>
    );
  }

  return (
    <>
      {/* ======================================================
          MENU LATERAL DE ATALHOS

          -Aparece só no computador pelo CSS
          -Clica e vai direto para a página
      ====================================================== */}
    {albumOpen
      ? createPortal(
         <nav
        className="album-page-shortcuts"
        onWheel={handleShortcutsWheel}
      >
        {pages.map((page) => {
          const pageThemeClass = getPageThemeClass(page);
          const isActive = activePageId === page.id;

          return (
            <button
              key={page.id}
              type="button"
              className={`album-page-shortcut ${pageThemeClass} ${
                isActive ? "active" : ""
              }`}
              onClick={() => {
                scrollToPage(page.id);
              }}
            >
              {getPageButtonLabel(page)}
            </button>
          );
        })}
      </nav>,
          document.body
        )
      : null}

      {pages.map((page) => (
        <AlbumPage
          key={page.id}
          page={page}
          stickersQuePossuo={stickersQuePossuo}
          pageRef={(element) => {
            if (element) {
              pageRefs.current[page.id] = element;
            } else {
              delete pageRefs.current[page.id];
            }
          }}
        />
      ))}
    </>
  );
}

export default Pages;