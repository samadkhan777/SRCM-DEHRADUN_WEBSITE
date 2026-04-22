import React, { Suspense, lazy, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "../components/Header";
import Error from "../components/Error";
import Events from "../components/EventList.js";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import AdminLogin from "../components/AdminLogin.js";
import EventList from "../components/EventList.js";
import PastEvents from "../components/PastEvents.js";
import InsertEvent from "../components/InsertEvent.js";
import EditEvent from "../components/EditEvent.js";
import Home from "../components/Home.js";
import AdminDashboard from "../components/AdminDashboard.js";
import AddPastEventImages from "../components/AddPastEventImages.js"; // ✅ NEW IMPORT

const About = lazy(() => import("../components/About.js"));

const AppLayout = () => {
    console.log("App running"); 
    const [dark , setDark] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = (isDark) => {
            setDark(isDark);
            document.documentElement.classList.toggle("dark", isDark);
        };

        applyTheme(media.matches);

        const listener = (e) => applyTheme(e.matches);
        media.addEventListener("change", listener);

        return () => media.removeEventListener("change", listener);
    }, []);
    
    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <Header />
            <Outlet />
        </div>
    );
};

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path:"/",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path:"/about",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <About />
                    </Suspense>
                ),
            },
            {
                path:"/events",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <Events />
                    </Suspense>
                ),
            },
            {
                path:"/adminLogin",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <AdminLogin />
                    </Suspense>
                ),
            },
            {
                path:"/adminDashboard",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <AdminDashboard />
                    </Suspense>
                ),
            },
            {
                path:"/eventList",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <EventList />
                    </Suspense>
                ),
            },
            {
                path:"/insertEvent",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <InsertEvent />
                    </Suspense>
                ),
            },
            {
                path: "/edit-event/:id",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <EditEvent />
                    </Suspense>
                ),
            },
            {
                path: "/past-event/:id",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <PastEvents />
                    </Suspense>
                ),
            },

            {
                path: "/add-images/:id",
                element: (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <AddPastEventImages />
                    </Suspense>
                ),
            },
        ],
        errorElement: <Error />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);