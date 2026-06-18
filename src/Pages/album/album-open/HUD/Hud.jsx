import "./Hud.css"
import Back from "./obj/Back"

function HUD({coverRef, galleryRef,setAlbumOpen}){
    
   

    
    return(
        <div className="hud-container">
            <Back
                coverRef={coverRef}
                galleryRef={galleryRef}
                setAlbumOpen={setAlbumOpen}
            />
        </div>
       
    )
}

export default HUD