import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";

function EventList() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    const location = useLocation();

    useEffect( () => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date_time", {ascending:true });

        console.log("EVENTS:", data);

        if (error) {
            console.log(error);
            return;
        }

        const now = new Date().toISOString();
        
        const upcoming = [];
        const past = [];

        data.forEach(event => {
            if (event.event_date_time >= now ) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });

        setUpcomingEvents(upcoming);
        setPastEvents(past.reverse());
    }

    return (
        <div className="p-6 w-full">

                    {/* Upcoming Events */}

            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Upcoming Events
            </h1>

                {upcomingEvents.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No Upcoming Events. Stay tuned !!!
                    </p>
                ) : (
                    <div className="max-w-5xl mx-auto">

                        {upcomingEvents.slice(0,1).map(event => (
                            <div 
                                key={event.id} 
                                className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg border bg-white"
                            >

                            {/*  Left Poster only if exists */}
                        {event.image_url && (
                            <div className="md:w-1/2 h-75 md:h-112.5"> 
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}  
                                        {/* Right side*/}
                        <div className={`flex flex-col  justify-center p-8 ${event.image_url ? "md:w-1/2" : "w-full"}`}>
                            
                            <h2 className="text-3xl font-semibold mb-3">
                                {event.title}
                            </h2>

                            <p className=" text-gray-500 mb-4 text-lg">
                                {new Date(event.event_date_time).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}    
                            </p>

                            {event.description && (
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {event.description}
                                </p>
                            )}
                        </div>        
                    </div>    
                ))}
            </div>
        )}
                        {/* Past Events */}        

            <h1 className="text-2xl font-bold mb-4">Past Events</h1>

            <div className="grid md:grid-cols-3 gap-4">
                {pastEvents.length === 0 && (
                    <p>No past Events to Show</p>
                )}

                {pastEvents.map(event => (
                    <div key={event.id} className="border rounded p-4 hover:shadow cursor-pointer">
                     
                        <h2 className="font-semibold">
                            {event.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {new Date(event.event_date_time).toLocaleString("en-IN" , {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>   
                ))}
            </div>    
            
        </div>
    );
}

export default EventList;

