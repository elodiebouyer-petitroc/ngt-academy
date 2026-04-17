import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { auth, createUserWithEmailAndPassword, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const trimmedEmail = email.toLowerCase().trim();
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      // Check if a manual user document exists (ID = email)
      const manualDocRef = doc(db, "users", trimmedEmail);
      const manualDocSnap = await getDoc(manualDocRef);
      
      let initialData: any = {
        email: trimmedEmail,
        displayName: displayName || trimmedEmail.split('@')[0],
        createdAt: serverTimestamp(),
        role: "user",
        hasAccessPsychology: false,
        hasAccessCameleon: false,
        hasAccessAlgo: false,
        isAlgoUser: false,
        isSniper: false,
        matricule: "",
        whatsappLink: "",
        zoomLink: ""
      };

      if (manualDocSnap.exists()) {
        const manualData = manualDocSnap.data();
        initialData = {
          ...initialData,
          ...manualData,
          isManual: false // No longer manual
        };
        // Delete the manual doc (ID=email) as we are moving to ID=UID
        await deleteDoc(manualDocRef);
      }

      // Create user profile in Firestore with UID as ID
      await setDoc(doc(db, "users", user.uid), initialData);

      navigate("/espace-membre");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe est trop faible.");
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
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
            <h1 className="text-3xl font-serif mb-4 italic gold-text">Créer un compte</h1>
            <p className="text-ngt-white/50 text-sm">
              Rejoignez la communauté NGT.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ngt-gold/50" size={18} />
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom" 
                className="w-full bg-ngt-white/5 border border-ngt-white/10 py-4 pl-12 pr-4 text-sm focus:border-ngt-gold outline-none transition-colors text-ngt-white"
              />
            </div>

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
                  S'inscrire <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-ngt-white/10 text-center">
            <p className="text-[10px] uppercase tracking-widest text-ngt-white/30">
              Déjà un compte ? <br />
              <Link to="/login" className="text-ngt-gold hover:underline mt-2 inline-block">Se connecter</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
