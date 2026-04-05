import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";

function PastEvents() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchEvent();
        fetchImages();
    }, []);

    async function fetchEvent() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();

       if (!error) setEvent(data);     
    }
    
    async function fetchImages() {
        const { data, error } = await supabase
            .from("event_images")
            .select("*")
            .eq("event_id", id)
            .order("created_at", { ascending: false });

       if (!error) setEvent(data);     
    }

    if (!event) return <p className="text-center mt-10">Loading...</p>

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                {event.title}
            </h1>

            {event.descrption && (
                <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    {event.descrption}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    
                        <img 
                            src={img.image_url}
                            alt="event"
                            className="w-full h-64 object-cover"
                        />

                        {img.caption && (
                            <p className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                {img.caption}
                            </p>
                        )}
                    </div>  
                ))}
            </div>
        </div>
    );

}

export default PastEvents;