import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

function AddPastEventImages() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const newItems = selectedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setItems(prev => [...prev, ...newItems]);
        e.target.value = null;
    };   
    
    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
    if (!items.length) {
        alert("Please select Images");
        return;
    }

    setLoading(true);

    for (const item of items) {
        const file = item.file;
        const fileName = `${Date.now()}-${file.name}`;

        // 1. Upload to storage
        const { error: uploadError } = await supabase.storage
            .from("event-images")
            .upload(fileName, file);

        if (uploadError) {
            console.error("UPLOAD ERROR:", uploadError);
            continue;
        }

        // console.log("Upload success:", fileName);

        // 2. Get public URL
        const { data } = supabase.storage
            .from("event-images")
            .getPublicUrl(fileName);

        const imageUrl = data.publicUrl;

        // console.log("Public URL:", imageUrl);

        // 3. Insert into DB
        const { error: insertError } = await supabase
            .from("past_event_images")
            .insert({
                event_id: id,
                image_url: imageUrl,
            });

        if (insertError) {
            console.error("INSERT ERROR:", insertError);
        } else {
            console.log("Insert success!");
        } 
    }

    setLoading(false);
    alert("Upload Successful");

    navigate(`/past-event/${id}`);
};
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 text-black dark:text-white">

            <h1 className="text-2xl font-bold mb-6">
                Upload Images for Event
            </h1>

            <input
                id="fileUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <label 
                htmlFor="fileUpload"
                className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 mb-4"
            >    
                Choose Images
            </label>

                    {/* FILE COUNT */}
            {items.length > 0 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {items.length} image(s) selected
                </p>
            )}        

                {/*     PREVIEW IMAGES    */}   
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {items.map( (item,index) => (
                       
                            <div key={index} className="relative rounded-lg border border-gray-300 overflow-hidden bg-white dark:bg-gray-800">
                                <img
                                    src={item.preview}
                                    alt="preview"
                                    className="w-full h-40 object-cover"
                                />    
                            
                                <button
                                    onClick={() => removeItem(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:cursor-pointer"
                                >   
                                    X  
                                </button>
                            </div> 
                    ))}
            </div>    

            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 cursor-pointer"
            >
                {loading ? "Uploading..." : "Upload Images"}
            </button>
        </div>
    );
}

export default AddPastEventImages;