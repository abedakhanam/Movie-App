// components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// // pages/dashboard.tsx
// import ProtectedRoute from '../components/ProtectedRoute';

// const Dashboard = () => {
//   return (
//     <ProtectedRoute>
//       <h1>Dashboard</h1>
//       {/* Rest of your dashboard content */}
//     </ProtectedRoute>
//   );
// };

// export default Dashboard;
