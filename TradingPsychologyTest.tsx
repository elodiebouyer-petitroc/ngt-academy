import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/espace-membre");
    } catch (err: any) {
      console.error(err);
      let message = "Une erreur est survenue lors de la connexion.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        message = "Email ou mot de passe incorrect.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Trop de tentatives. Veuillez patienter.";
      } else if (err.code === "auth/network-request-failed") {
        message = "Erreur réseau. Vérifiez votre connexion.";
      } else if (err.message) {
        message = `Erreur: ${err.message}`;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-ngt-black relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ngt-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-ngt-white/[0.02] border border-ngt-white/10 p-10 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif mb-4 italic gold-text">Espace Membre</h1>
            <p className="text-ngt-white/50 text-sm">
              Connectez-vous à votre compte.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-gold/50" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com" 
                required
                className="w-full bg-ngt-white/5 border border-ngt-white/10 py-4 pl-12 pr-4 text-sm focus:border-ngt-gold outline-none transition-colors text-ngt-white"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-gold/50" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe" 
                required
                className="w-full bg-ngt-white/5 border border-ngt-white/10 py-4 pl-12 pr-4 text-sm focus:border-ngt-gold outline-none transition-colors text-ngt-white"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ngt-gold text-ngt-black text-xs uppercase tracking-widest font-bold gold-gradient flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  Se connecter <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-ngt-white/10 text-center space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-ngt-white/30">
              Pas encore de compte ? <br />
              <Link to="/signup" className="text-ngt-gold hover:underline mt-2 inline-block">Créer un compte</Link>
            </p>
            <p className="text-[10px] uppercase tracking-widest text-ngt-white/30">
              <a href="/#products" className="text-ngt-white/50 hover:text-ngt-gold transition-colors">Découvrir nos formations</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
