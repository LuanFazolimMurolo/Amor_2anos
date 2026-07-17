import "./AlbumPage.css";

import Sticker from "../Sticker/Sticker.jsx";
import { getPageThemeClass } from "../utils/getPageThemeClass.js";

function AlbumPage({ page, stickersQuePossuo, pageRef }) {
  const pageThemeClass = getPageThemeClass(page);

  return (
    <section
      ref={pageRef}
      className={`album-gallery-section album-month-page ${pageThemeClass}`}
    >
      <div className="album-month-title">
        <h1>{page.month}</h1>

        {page.age ? (
          <p>
            {page.type === "month" ? `${page.age} ano` : page.age}
          </p>
        ) : null}
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