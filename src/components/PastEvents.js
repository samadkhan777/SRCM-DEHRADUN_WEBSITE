import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";

function PastEvents() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        init();
    }, [id]); 

    async function init() {
        const eventData = await fetchEvent();
        if (eventData) {
            fetchImages(eventData.id);
        }
    }
    
    async function fetchEvent() {
        const { data, error } = await supabase
            .from("past_events")
            .select("*")
            .eq("id", id)
            .single();
        
        if (!error) {
            setEvent(data);
            return data;
        }

        console.error("Error fetching event:", error);
        return null;
    }

    async function fetchImages(eventId) {
        const { data, error } = await supabase
            .from("past_event_images")
            .select("*")
            .eq("event_id", eventId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching images:", error);
            return;
        }

        setImages(data || []);
    }

    if (!event) return <p className="text-center mt-10">Loading...</p>;

            
    const formattedDate = event.event_date_time
        ? new Date(event.event_date_time).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "";

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-10">

                    {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                {event.title}
            </h1>

                    {/* Date */}
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                {formattedDate}
            </p>

                    {/* Description */}
            {event.description && (
                <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    {event.description}
                </p>
            )}

                    {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {images.map((img) => (
                    <div 
                        key={img.id} 
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                    >
                        <img 
                            src={img.image_url}
                            alt="event"
                            className="w-full h-64 object-cover hover:scale-105 transition duration-300"
                        />

                        {img.caption && (
                            <p className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                {img.caption}
                            </p>
                        )}
                    </div>  
                ))}
            </div>

                {/*  EMPTY STATE */}
            {images.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    No images uploaded for this event yet.
                </p>
            )}
        </div>
    );
}

export default PastEvents;