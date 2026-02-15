import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Check if user has a role stored
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role);
                    }
                } catch (err) {
                    console.log('Firestore not configured yet, using local role');
                    const savedRole = localStorage.getItem('cnis_role');
                    if (savedRole) setRole(savedRole);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error('Login failed:', error);
            // Demo mode fallback
            if (error.code === 'auth/configuration-not-found' ||
                error.code === 'auth/api-key-not-valid' ||
                error.code === 'auth/invalid-api-key') {
                const demoUser = {
                    uid: 'demo-user-' + Date.now(),
                    displayName: 'Demo User',
                    email: 'demo@cnis.app',
                    photoURL: null,
                    isDemo: true
                };
                setUser(demoUser);
                return demoUser;
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            // Demo mode
        }
        setUser(null);
        setRole(null);
        localStorage.removeItem('cnis_role');
        window.location.href="login";
    };

    const selectRole = async (selectedRole) => {
        setRole(selectedRole);
        localStorage.setItem('cnis_role', selectedRole);
        if (user && !user.isDemo) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    role: selectedRole,
                    email: user.email,
                    displayName: user.displayName,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (err) {
                console.log('Could not save role to Firestore');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout, selectRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
