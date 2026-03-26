import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate, useParams } from "react-router-dom";

function EditEvent() {
    const {id} = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDateTime, setEventDateTime] = useState(""); 
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchEvent();
    }, []);

    async function checkUser() {
        const { data } = await supabase.auth.getUser();

        if(!data.user){
            navigate("/adminLogin");
        }
    }

    async function fetchEvent() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            alert("Failed to load event");
            return;
        }
        
        setTitle(data.title);
        setDescription(data.description);
        setEventDateTime(data.event_date_time?.slice(0,16));
        setExistingImage(data.image_url);
        setPreview(data.image_url);
    }

    async function createEvent() {

        if (!title || !eventDateTime) {
            alert("Title and Date are required");
            return;
        }

        let imageUrl = existingImage;

        if (image) {

            const fileName = `posters/${Date.now()} - ${image.name}`;

            const { error: uploadError } = await supabase.storage 
                .from("event-images")
                .upload(fileName, image);

            if (uploadError) {
                console.log(uploadError);
                alert("Image upload failed");
                return;
            }
            
            const { data: publicUrlData } = supabase.storage
                .from('event-images')
                .getPublicUrl(fileName);
            
            imageUrl = publicUrlData.publicUrl;    
        }

        console.log("ID being used:", id);

        const {data: checkdata} = await supabase
            .from("events")
            .select("*")
            .eq("id",id);

        console.log("Matching row: ",checkdata);    

        const { error} = await supabase
            .from("events")
            .update(
                {   title, 
                    description, 
                    image_url: imageUrl,
                    event_date_time: new Date(eventDateTime).toISOString(),
                }
            )
              .eq("id", id)

        if (error) {
            console.log("UPDATE ERROR:", error);
            alert(error.message);
        } else {
            alert("Event updated!");
            navigate("/events" , { state: { refresh: true }});
        }  
        
    }   

    return (
        <div className="flex justify-center mt-10">

            <div className="flex flex-col gap-4 w-[400px]">

                <h2 className="text-xl font-semibold">
                    Edit Event    
                </h2>

            <input
                className="border p-2 rounded"
                value={title}
                placeholder="Event title"
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="border p-2 rounded"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
            />

            <input 
                type="datetime-local"
                className="border p-2 rounded"
                value={eventDateTime}
                onChange={(e) => setEventDateTime(e.target.value)}
            />

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded"
                />     
            )}

            <input
                className="border p-2 rounded hover:cursor-pointer" 
                type="file"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                }}
            />

            <button 
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer" 
                onClick={createEvent} >
                Update Event
            </button>        
        
        </div>
    </div>

    );
}

export default EditEvent;