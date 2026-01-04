import {
  type Auth,
  type AuthError,
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  applyActionCode,
  type User,
  updateProfile,
} from 'firebase/auth';
import { type Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

type UserRole = 'organizer' | 'participant';

export const signUpWithEmail = async (
  auth: Auth,
  firestore: Firestore,
  email: string,
  password: string,
  username: string,
  role: UserRole,
  location: string
): Promise<{ user?: User; error?: AuthError }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: username });

    // Create user profile in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: username,
      role: role,
      location: location,
      createdAt: serverTimestamp(),
    });

    // Send verification email and sign out
    await sendVerificationEmail(user);
    await signOut(auth); // Sign out immediately

    return { user };
  } catch (error) {
    return { error: error as AuthError };
  }
};

export const signInWithEmail = async (
  auth: Auth,
  email: string,
  password: string
): Promise<{ user?: User, success: boolean; verified: boolean; error?: AuthError }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      return { user, success: true, verified: true };
    } else {
      await sendVerificationEmail(user);
      await signOut(auth);
      return { success: true, verified: false };
    }
  } catch (error) {
    return { success: false, verified: false, error: error as AuthError };
  }
};

export const sendVerificationEmail = async (user: User): Promise<void> => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true,
  };
  await firebaseSendEmailVerification(user, actionCodeSettings);
};

export const applyVerificationCode = async (auth: Auth, actionCode: string): Promise<boolean> => {
    try {
        await applyActionCode(auth, actionCode);
        return true;
    } catch (error) {
        console.error("Error applying verification code:", error);
        return false;
    }
};

export const signOutUser = async (auth: Auth) => {
  try {
    await signOut(auth);
    // Clear any session storage if needed
    sessionStorage.removeItem('emailForVerification');
    sessionStorage.removeItem('userRole');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
