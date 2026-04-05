import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

function AdminDashboard(){
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchEvents();
    }, []);

    async function checkUser() {
        const {data} = await supabase.auth.getUser();
        
        if (!data.user) {
            navigate("/adminLogin");
        }
    }

    async function fetchEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("event_date_time", { ascending: true });

            if (!error && data ) {
                const now = new Date();

                const upcoming = data.filter(
                    e => new Date(e.event_date_time) >= now && !e.is_past
                );

                const past = data.filter(
                    e => new Date(e.event_date_time) < now || e.is_past
                );

                setUpcomingEvents(data.filter(e => !e.is_past));
                setPastEvents(data.filter(e => e.is_past));
            }
    }

    async function deleteEvent(id) {
        const confirmDelete = window.confirm("Delete this event permanently ? WARNING: this action can't be undone");
        if( !confirmDelete ) return;

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);
            
        if (!error) {
            setUpcomingEvents(prev => prev.filter(e => e.id !== id));
            setPastEvents(prev => prev.filter(e => e.id !== id));  
        }    
    }

    async function markAsCompleted(id) {
        const { error } = await supabase
            .from("events")
            .update({ is_past:true})
            .eq("id",id);

        if (!error) {
            fetchEvents();
        }    
    }

    return (
        <div className="p-6">
                               
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
                Admin Dashboard
            </h1>
                                 {/* ADD EVENT BUTTON */}
            <button 
                onClick={() => navigate("/insertEvent")}
                className="mb-8 bg-green-500 text white px-4 py-2 rounded"
            >
                Add New Event
            </button>

                                {/* UPCOMING EVENTS*/}
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Upcoming Events
            </h2>

            {upcomingEvents.map(event =>
                <div key={event.id} className="mb-4 p-4 border rounded dark:border-gray-700">
                    <h3 className="text-lg dark:text-white">{event.title}</h3>

                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => navigate(`/edit-event/${event.id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>

                        <button 
                            onClick={() => markAsCompleted(event.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Mark Completed
                        </button>            
                    </div>
                </div>    
            )}

                            {/* PAST EVENTS */}
            <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white"> 
                Past Events
            </h2>

            {pastEvents.map(event => (
                <div key={event.id} className="mb-4 p-4 border rounded dark:border-gray-700">
                    <h3 className="text-lg dark:text-white">{event.title}</h3>

                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => navigate(`/edit-event/${event.id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                 </div>   
            ))}                

        </div>
    );
}

export default AdminDashboard;