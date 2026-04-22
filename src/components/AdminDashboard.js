import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
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
                    // UPCOMING EVENTS
        const { data: upcomingData, error: upcomingError } = await supabase
            .from("events")
            .select("*")
            .order("event_date_time", { ascending: true });

        if (upcomingError) {
            console.error("Error fetching Upcoming Events:", upcomingError);
            setUpcomingEvents([]);
        } else {
            setUpcomingEvents(upcomingData || []);
        }

                    // PAST EVENTS
        const { data: pastData, error: pastError } = await supabase
            .from("past_events")
            .select("*")
            .order("event_date_time", { ascending: false });

        if (pastError) {
            console.error("Error fetching Past events:", pastError);
            setPastEvents([]);
        } else {
            setPastEvents(pastData || []);
        }
    }

    //    delete handles BOTH tables
    async function deleteEvent(id, type) {
        const confirmDelete = window.confirm(
            "Delete this event permanently? WARNING: this action can't be undone"
        );
        if (!confirmDelete) return;

        const table = type === "past" ? "past_events" : "events";

        const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", id);

        if (!error) {
            if (type === "past") {
                setPastEvents(prev => prev.filter(e => e.id !== id));
            } else {
                setUpcomingEvents(prev => prev.filter(e => e.id !== id));
            }
        } else {
            console.log(error);
        }
    }

    async function markAsCompleted(id) {
        // GET EVENT
        const { data: eventData, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            return;
        }

        // INSERT INTO PAST EVENTS
        const { error: insertError } = await supabase
            .from("past_events")
            .insert([{
                event_id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                event_date_time: eventData.event_date_time,
                image_url: eventData.image_url //  keep image
            }]);

        if (insertError) {
            console.log(insertError);
            return;
        }

        // DELETE FROM EVENTS
        const { error: deleteError } = await supabase
            .from("events")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.log(deleteError);
            return;
        }

        await fetchEvents();
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">

            <h1 className="text-3xl font-bold mb-6 dark:text-white">
                Admin Dashboard
            </h1>

            {/* ADD EVENT */}
            <button
                onClick={() => navigate("/insertEvent")}
                className="mb-8 bg-green-500 text-white px-4 py-2 rounded"
            >
                Add New Event
            </button>

            {/* UPCOMING EVENTS */}
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Upcoming Events
            </h2>

            {upcomingEvents.map(event => (
                <div key={event.id} className="mb-4 p-4 border rounded dark:border-gray-700">
                    <h3 className="text-lg dark:text-white">{event.title}</h3>

                    <div className="flex gap-2 mt-2">
                        <button
                            // ✅ NORMAL EDIT
                            onClick={() => navigate(`/edit-event/${event.id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            // ✅ DELETE FROM EVENTS
                            onClick={() => deleteEvent(event.id, "upcoming")}
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
            ))}

            {/* PAST EVENTS */}
            <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">
                Past Events
            </h2>

            {pastEvents.map(event => (
                <div key={event.id} className="mb-4 p-4 border rounded dark:border-gray-700">
                    <h3 className="text-lg dark:text-white">{event.title}</h3>

                    <div className="flex gap-2 mt-2">
                        <button
                            
                            onClick={() => navigate(`/edit-event/${event.id}?type=past`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            // ✅ DELETE FROM PAST_EVENTS
                            onClick={() => deleteEvent(event.id, "past")}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => navigate(`/add-images/${event.id}`)}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                        >
                            Add Images
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;