import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

function DeleteEvent() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect( () => {
        checkUser();
        fetchEvents();
    }, []);

    async function checkUser() {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
            navigate("/adminLogin");
        }
    }

    async function fetchEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false });
            
        if (!error ) setEvents(data);
    }

    async function deleteEvent(id) {
        const confirmDelete = window.confirm(
            " Delete this event permanently ?  WARNING: THIS CAN'T BE UNDONE"
        );
        if(!confirmDelete) return;

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);

        if (!error) {
            setEvents(events.filter(e => e.id !== id));
        }    
    }

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6 dark:text-white">
                Delete Events
            </h1>

            {events.length === 0 ? (
                <p className="dark:text-white">No events found.</p>
            ) : (
                events.map(event => (
                    <div 
                        key={event.id}
                        className="mb-4 p-4 border rounded dark:border-gray-700"
                    >

                        <h2 className="text-lg dark:text-white">
                            {event.title}    
                        </h2>

                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>                
                ))
            )}

        </div>
    );
}

export default DeleteEvent;