import "./Album.css";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import Album_Cover from "./album-cover/Album_Cover.jsx";
import Album_Open from "./album-open/Album_Open.jsx";


function Album() {
  const [albumOpen, setAlbumOpen] = useState(false);
  const areaRef = useRef(null);

  const sectionRef = useRef(null);
  const coverRef = useRef(null);
  const galleryRef = useRef(null);

  const coverContentRef = useRef(null); 



  
  
  




  return (
    <div className={`album-page ${albumOpen ? "album-open" : ""}`} ref={sectionRef}>
      

      
      <Album_Cover
        coverRef={coverRef}
        coverContentRef={coverContentRef}
        areaRef={areaRef}
        albumOpen={albumOpen}
        setAlbumOpen={setAlbumOpen}
        galleryRef={galleryRef}
        sectionRef={sectionRef}
      />

       
      <Album_Open
        coverRef={coverRef}
        galleryRef={galleryRef}
        setAlbumOpen={setAlbumOpen}

      />

      
      </div>

  );
}

export default Album;