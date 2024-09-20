// import { initialState, UserState } from "./userSlice";

// // Save user state to localStorage
// export const saveUserState = (state: UserState) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem("userState", serializedState);
//   } catch (err) {
//     console.error("Could not save user state", err);
//   }
// };

// // Load user state from localStorage
// export const loadUserState = (): UserState => {
//   try {
//     const serializedState = localStorage.getItem("userState");
//     if (serializedState === null) {
//       return initialState;
//     }
//     return JSON.parse(serializedState);
//   } catch (err) {
//     console.error("Could not load user state", err);
//     return initialState;
//   }
// };
