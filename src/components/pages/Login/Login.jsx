import { useContext } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";

const Login = () => {
  const { googleLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const notifyGoogle = (e) => toast.success(e);
  const notifyGoogleError = (e) => toast.error(e);

  const handleGoogleLogin = () => {
    googleLogin()
      .then((res) => {
        notifyGoogle(res.user.displayName);
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => notifyGoogleError(error.message));
  };

  return (
    <div className="relative min-h-[calc(100svh-var(--nav-h))] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-lens-glow opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(60%_50%_at_50%_50%,#000,transparent)]" />

      <div className="relative max-w-md w-full bg-ground-card p-8 rounded-2xl border border-white/10 shadow-card">
        {/* header */}
        <button
          onClick={() => navigate("/")}
          className="text-ink-dim hover:text-ink text-xl transition mb-6 inline-flex"
          aria-label="Go Back"
        >
          <IoArrowBack />
        </button>

        <h5 className="font-display text-3xl font-bold ink-gradient text-center mb-2">
          Sign in to Samvaada
        </h5>
        <p className="text-center text-sm text-ink-faint mb-8">
          Use your college account to enter the archive.
        </p>

        <div className="mb-8 space-y-3">
          <div className="border border-white/[0.07] bg-white/[0.02] p-4 rounded-sm">
            <p className="text-ink font-semibold text-sm">Are you a student?</p>
            <p className="text-ink-dim text-sm mt-1">
              Login with the account ending in{" "}
              <span className="font-mono text-brand-glow">@nmamit.in</span>
            </p>
          </div>
          <div className="border border-white/[0.07] bg-white/[0.02] p-4 rounded-sm">
            <p className="text-ink font-semibold text-sm">Are you a Faculty member?</p>
            <p className="text-ink-dim text-sm mt-1">
              Login with the account ending in{" "}
              <span className="font-mono text-brand-glow">@nitte.edu.in</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-sm py-3 transition"
        >
          <FcGoogle className="text-2xl" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
