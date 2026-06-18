import "./Album_Open.css"

import HUD from "./HUD/Hud.jsx"
import Pages from "./Pages/Pages.jsx"



function Album_Open({coverRef, galleryRef, setAlbumOpen}){
    return(
        <div className="album-gallery-container" ref={galleryRef}>
            <HUD 
            coverRef={coverRef}
            galleryRef={galleryRef}
            setAlbumOpen={setAlbumOpen}
            />

            <Pages/>
            

        </div>

    )

}

export default Album_Open