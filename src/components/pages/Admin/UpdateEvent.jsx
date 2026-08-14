import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase.config";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { toast } from "react-toastify";
import isAdminEmail from "../../../utils/isAdmin";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventDriveLink: "",
    eventFor: "",
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docSnap = await getDoc(doc(db, "events", id));
        if (!docSnap.exists()) throw new Error("Event not found.");
        setEventData((prev) => ({ ...prev, ...docSnap.data() }));
        setLoaded(true);
      } catch (err) {
        // rendering the blank form here would let a submit overwrite the doc
        toast.error(err.message || "Couldn't load this event.");
        navigate("/events");
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminEmail(user?.email)) {
      toast.error("Unauthorized access");
      return;
    }

    try {
      await updateDoc(doc(db, "events", id), eventData);
      toast.success("Event updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error updating event");
    }
  };

  if (!loaded) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-ink-dim">
        Loading event…
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto mt-10 bg-[#1A202C] p-8 rounded-lg shadow-xl text-[#89A3B6]">
        <h2 className="text-3xl font-bold mb-8 text-center">Update Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              value={eventData.eventName}
              onChange={handleChange}
              required
              className="input input-bordered w-full p-3 bg-[#243E51] text-[#89A3B6] placeholder-[#89A3B6] focus:outline-none focus:ring-2 focus:ring-[#496980]"
            />
          </div>
          <div className="form-control">
            <textarea
              name="eventDescription"
              placeholder="Event Description"
              value={eventData.eventDescription}
              onChange={handleChange}
              required
              rows="4"
              className="textarea textarea-bordered w-full p-3 bg-[#243E51] text-[#89A3B6] placeholder-[#89A3B6] focus:outline-none focus:ring-2 focus:ring-[#496980] resize-none"
            />
          </div>
          <div className="form-control">
            <input
              type="date"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleChange}
              required
              className="input input-bordered w-full p-3 bg-[#243E51] text-[#89A3B6] focus:outline-none focus:ring-2 focus:ring-[#496980]"
            />
          </div>
          <div className="form-control">
            <input
              type="url"
              name="eventDriveLink"
              placeholder="Drive Link"
              value={eventData.eventDriveLink}
              onChange={handleChange}
              required
              className="input input-bordered w-full p-3 bg-[#243E51] text-[#89A3B6] placeholder-[#89A3B6] focus:outline-none focus:ring-2 focus:ring-[#496980]"
            />
          </div>
          <button
            type="submit"
            className="btn w-full mt-8 bg-gradient-to-br from-[#496980] to-[#5C7B92] text-white hover:bg-gradient-to-bl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
