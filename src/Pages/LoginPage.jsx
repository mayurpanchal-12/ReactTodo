import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
    sendEmailVerification,        

} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function LoginPage() {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister]         = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');
  const [loading, setLoading]               = useState(false);


  const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => v.length >= 6;

  const getFirebaseError = (code) => {
    switch (code) {
      case 'auth/user-not-found':        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':  return 'An account with this email already exists. Please login.';
      case 'auth/weak-password':         return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':         return 'Please enter a valid email address.';
      case 'auth/invalid-credential':    return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':     return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':return 'Network error. Please check your connection.';
      case 'auth/email-not-verified': return 'Please verify your email first.';
default: return 'Something went wrong. Please try again.';
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateEmail(email))    { setError('Please enter a valid email address.'); return; }
    if (!validatePassword(password)) { setError('Password must be at least 6 characters.'); return; }
    if (isRegister && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      if (isRegister) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  await auth.signOut();           // block entry until verified
 setSuccess('Account created! A verification email has been sent. Check your inbox and spam/junk folder before logging in.');

  setIsRegister(false);           // switch back to login view
} else {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (!result.user.emailVerified) {
    await auth.signOut();         // kick them out immediately
    setError('Please verify your email before logging in. Check your inbox and spam/junk folder.');
    return;
  }
}
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(''); setSuccess('');
    if (!email)                { setError('Please enter your email address first.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox and spam folder.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else setError('Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Logo ── */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>✓</div>
          <span style={styles.logoText}>Task<span style={styles.logoAccent}>Flow</span></span>
        </div>
        <p style={styles.tagline}>
          {isRegister ? 'Create your account' : 'Welcome back'}
        </p>

        {/* ── Error / Success banners ── */}
        {error && (
          <div style={{ ...styles.banner, ...styles.bannerError }}>
            <svg style={styles.bannerIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div style={{ ...styles.banner, ...styles.bannerSuccess }}>
            <svg style={styles.bannerIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* ── Google button ── */}
        <button onClick={handleGoogle} disabled={loading} style={styles.googleBtn}>
          <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>

        {/* ── Divider ── */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with email</span>
          <div style={styles.dividerLine} />
        </div>

        {/* ── Email form ── */}
        <form onSubmit={handleEmailAuth} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            style={styles.input}
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          )}
          {!isRegister && (
            <p onClick={handleForgotPassword} style={styles.forgotLink}>
              Forgot password?
            </p>
          )}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        {/* ── Toggle register / login ── */}
        <p
          onClick={() => { setIsRegister(p => !p); setError(''); setSuccess(''); }}
          style={styles.toggleText}
        >
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span style={styles.toggleLink}>
            {isRegister ? 'Sign in' : 'Register'}
          </span>
        </p>

      </div>

      {/* ── Footer ── */}
      <p style={styles.footer}>Your tasks · Your way · Always in sync</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'var(--bg-app, #0f0f13)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: 'var(--bg-card, #1a1a24)',
    border: '0.5px solid var(--border, rgba(255,255,255,0.08))',
    borderRadius: 20,
    padding: '2rem 2rem 1.5rem',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 6,
  },
  logoIcon: {
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'var(--accent, #6366f1)',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-main, #f1f1f1)',
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    color: 'var(--accent, #6366f1)',
  },
  tagline: {
    textAlign: 'center',
    fontSize: 13,
    color: 'var(--text-light, #888)',
    marginBottom: '1.5rem',
  },
  banner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 10,
    padding: '10px 12px',
    marginBottom: '1rem',
  },
  bannerError: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171',
  },
  bannerSuccess: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.2)',
    color: '#4ade80',
  },
  bannerIcon: {
    width: 14, height: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '10px 16px',
    borderRadius: 12,
    border: '0.5px solid var(--border, rgba(255,255,255,0.12))',
    background: 'var(--bg-input, rgba(255,255,255,0.04))',
    color: 'var(--text-main, #f1f1f1)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '1.25rem',
    transition: 'background 0.15s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '1.25rem',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--border, rgba(255,255,255,0.08))',
  },
  dividerText: {
    fontSize: 11,
    color: 'var(--text-light, #666)',
    whiteSpace: 'nowrap',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: '0.5px solid var(--border, rgba(255,255,255,0.1))',
    background: 'var(--bg-input, rgba(255,255,255,0.04))',
    color: 'var(--text-main, #f1f1f1)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  forgotLink: {
    textAlign: 'right',
    fontSize: 12,
    color: 'var(--accent, #6366f1)',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: -4,
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    borderRadius: 12,
    border: 'none',
    background: 'var(--accent, #6366f1)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'opacity 0.15s',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--text-light, #888)',
    marginTop: '1.25rem',
    cursor: 'pointer',
  },
  toggleLink: {
    color: 'var(--accent, #6366f1)',
    fontWeight: 600,
  },
  footer: {
    marginTop: '1.25rem',
    fontSize: 11,
    color: 'var(--text-light, #555)',
    textAlign: 'center',
  },
};