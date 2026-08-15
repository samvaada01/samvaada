import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiSave } from "react-icons/fi";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import isAdminEmail from "../../../utils/isAdmin";
import {
  fetchCommunitySettings,
  saveCommunitySettings,
  FALLBACK_LINKS,
  DEFAULT_CLOSED_MESSAGE,
} from "../../../utils/communitySettings";

const ManageCommunity = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const [closedMessage, setClosedMessage] = useState(DEFAULT_CLOSED_MESSAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readFailed, setReadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCommunitySettings().then((s) => {
      if (cancelled) return;
      setOpen(s.open);
      setLinks(s.links);
      setClosedMessage(s.closedMessage);
      setReadFailed(Boolean(s.error));
      if (s.error) console.error("Community settings read failed", s.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // one write path, so a failed save always restores what's actually live
  const commit = async (patch, message) => {
    if (!isAdminEmail(user?.email)) {
      toast.error("Unauthorized access");
      return;
    }
    setSaving(true);
    try {
      await saveCommunitySettings(patch);
      toast.success(message);
    } catch (err) {
      toast.error(err.message || "Couldn't save. Check your Firestore rules.");
      const s = await fetchCommunitySettings();
      setOpen(s.open);
      setLinks(s.links);
      setClosedMessage(s.closedMessage);
    } finally {
      setSaving(false);
    }
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    commit({ open: next }, next ? "Community joining is now OPEN." : "Community joining is now CLOSED.");
  };

  const handleSaveLinks = (e) => {
    e.preventDefault();
    const bad = Object.entries(links).find(([, url]) => !/^https:\/\/\S+$/i.test(url.trim()));
    if (bad) {
      toast.error(`${bad[0]} needs a full https:// link.`);
      return;
    }
    const trimmed = Object.fromEntries(
      Object.entries(links).map(([b, url]) => [b, url.trim()])
    );
    setLinks(trimmed);
    commit({ links: trimmed, closedMessage: closedMessage.trim() }, "Saved.");
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto mt-10 bg-[#1A202C] p-8 rounded-lg shadow-xl text-[#89A3B6]">
        <h2 className="text-3xl font-bold mb-2 text-center">Community</h2>
        <p className="text-center text-sm mb-8 opacity-70">
          Controls what visitors see at <code>/community</code>.
        </p>

        {readFailed && (
          <p className="mb-6 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
            Couldn&apos;t read <code>siteContent/community</code> — showing the built-in defaults.
            Saving will fail until your Firestore rules allow this document.
          </p>
        )}

        {loading ? (
          <p className="text-center opacity-70">Loading…</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#243E51] p-4 mb-8">
              <div>
                <p className="font-semibold text-white">
                  Joining is {open ? "open" : "closed"}
                </p>
                <p className="text-sm opacity-70">
                  {open
                    ? "Visitors can pick their branch and get the WhatsApp link."
                    : "Visitors see the closed message below instead of the join form."}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleOpen}
                disabled={saving}
                className={`btn border-none px-5 text-white disabled:opacity-50 ${
                  open ? "bg-red-600 hover:bg-red-500" : "bg-green-700 hover:bg-green-600"
                }`}
              >
                {open ? "Disable community" : "Enable community"}
              </button>
            </div>

            <form onSubmit={handleSaveLinks}>
              <label className="block mb-2 font-semibold text-white" htmlFor="closedMessage">
                Closed message
              </label>
              <textarea
                id="closedMessage"
                rows={3}
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                className="w-full mb-8 p-3 rounded bg-[#243E51] text-[#89A3B6] placeholder-[#89A3B6]/60 focus:outline-none focus:ring-2 focus:ring-[#496980]"
                placeholder={DEFAULT_CLOSED_MESSAGE}
              />

              <h3 className="mb-3 font-semibold text-white">WhatsApp joining links</h3>
              <div className="space-y-3">
                {Object.keys(links).map((b) => (
                  <div key={b}>
                    <label className="block text-sm mb-1 opacity-80" htmlFor={`link-${b}`}>
                      {b}
                    </label>
                    <input
                      id={`link-${b}`}
                      type="url"
                      value={links[b]}
                      onChange={(e) => setLinks({ ...links, [b]: e.target.value })}
                      className="w-full p-2.5 rounded bg-[#243E51] text-[#89A3B6] focus:outline-none focus:ring-2 focus:ring-[#496980]"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn mt-8 w-full bg-[#496980] hover:bg-[#5a7f99] text-white border-none disabled:opacity-50"
              >
                <FiSave /> {saving ? "Saving…" : "Save links & message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageCommunity;
