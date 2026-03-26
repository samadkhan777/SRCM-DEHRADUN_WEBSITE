import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

function InsertEvent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDateTime, setEventDateTime] = useState(""); 
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
      async function init() {
        const { data } = await supabase.auth.getUser();

        if(!data.user){
            navigate("/adminLogin");
            return;
        }
        fetchUpcomingEvent();
    }
    
        init();
    }, []);

    async function fetchUpcomingEvent() {

        const { data, error } = await supabase
            .from("events")
            .select("*")
            .gte("event_date_time", new Date().toISOString()) 
            .order("event_date_time", {ascending:true})
            .limit(1);

        if (error) {
            console.log(error);
            return;
        }    

        if ( data && data.length > 0) {
            setUpcomingEvent(data[0]);
        }
    }

    async function createEvent() {

        if (!title || !eventDateTime) {
            alert("Title and Date are required");
            return;
        }

        let imageUrl = null;

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

        const {error} = await supabase
            .from("events")
            .insert([
                {   title, 
                    description, 
                    image_url: imageUrl,
                    event_date_time: new Date(eventDateTime).toISOString()
                }
            ]);

        if (error) {
            console.log(error);
            alert("You are not authorized to add events OR you made a mistake");
        } else {
            alert("Event created!");
            fetchUpcomingEvent();

         // Clear Form
            setTitle("");
            setDescription("");
            setEventDateTime("");
            setImage(null);
            setPreview(null);
        }    
    }

    return (
        <div className="flex justify-center mt-10">

            <div className="flex flex-col gap-4 w-[400px]">

                <h2 className="text-xl font-semibold">
                    Add Upcoming Event    
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
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer" 
                onClick={createEvent} >
                Add Upcoming Event
            </button>

            {upcomingEvent && (
                <button
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer"
                    onClick={() => navigate(`/edit-event/${upcomingEvent.id}`)}
                >
                    Edit Current Upcoming Event
                </button>
            )}        
        
        </div>
    </div>

    );
}

export default InsertEvent;