import "./AlbumPage.css";

import Sticker from "../Sticker/Sticker.jsx";

function AlbumPage({ page, stickersQuePossuo }) {
  return (
    <section className="album-gallery-section album-month-page">
      <div className="album-month-title">
        <h1>{page.month}</h1>
        <p>{page.age} ano</p>
      </div>

      <div className="album-stickers-area">
        {page.stickers.map((sticker) => {
          const desbloqueada = stickersQuePossuo.has(sticker.id);

          return (
            <Sticker
              key={sticker.id}
              sticker={sticker}
              desbloqueada={desbloqueada}
            />
          );
        })}
      </div>
    </section>
  );
}

export default AlbumPage;