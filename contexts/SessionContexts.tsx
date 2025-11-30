// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   ReactNode,
// } from "react";
// import { useAuth } from "@/providers/AuthProvider";
// import * as storageService from "@/services/storageService";

// type SessionContextType = {
//   isIdle: boolean;
//   resetTimer: () => void;
// };

// const SessionContext = createContext<SessionContextType | undefined>(undefined);

// const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
// const STORAGE_KEY = "lastActivity";

// export function SessionProvider({ children }: { children: ReactNode }) {
//   const { logout } = useAuth();
//   const [isIdle, setIsIdle] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   // 🔄 Reset timer on activity
//   const resetTimer = () => {
//     setIsIdle(false);
//     storageService.setItem(STORAGE_KEY, Date.now());
//     if (timerRef.current) clearTimeout(timerRef.current);

//     timerRef.current = setTimeout(() => {
//       setIsIdle(true);
//       logout(); // auto-logout
//     }, IDLE_TIMEOUT);
//   };

//   // ⌨️ Listen for activity
//   useEffect(() => {
//     const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

//     const activityHandler = () => resetTimer();
//     events.forEach((event) => window.addEventListener(event, activityHandler));

//     // restore last activity from storage (persisted session)
//     const lastActivity = storageService.getItem(STORAGE_KEY);
//     if (lastActivity && Date.now() - lastActivity < IDLE_TIMEOUT) {
//       resetTimer();
//     } else {
//       logout();
//     }

//     return () => {
//       events.forEach((event) =>
//         window.removeEventListener(event, activityHandler)
//       );
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, []);

//   return (
//     <SessionContext.Provider value={{ isIdle, resetTimer }}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export const useSession = () => {
//   const ctx = useContext(SessionContext);
//   if (!ctx) throw new Error("useSession must be used inside SessionProvider");
//   return ctx;
// };
