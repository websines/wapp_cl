import {Circle} from 'better-react-spinkit';
function Loading() {
    return (
        <div style={{display: "grid",placeItems: "center",height:"100vh"}}>
            <img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png" alt="..." height={200}/>
            <Circle color="#3CBC28" size={60}/>
            
        </div>
    )
}

export default Loading
