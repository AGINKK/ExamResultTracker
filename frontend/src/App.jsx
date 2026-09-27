import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentResults from "./pages/StudentResults";
import StudentTranscript from "./pages/StudentTranscript";
import StudentNotifications from "./pages/StudentNotifications";
import StudentSettings from "./pages/StudentSettings";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherResults from "./pages/TeacherResults";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherAnnouncements from "./pages/TeacherAnnouncements";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";
import AdminStudents from "./pages/AdminStudents";
import AdminTeachers from "./pages/AdminTeachers";
import AdminCourses from "./pages/AdminCourses";
import AdminSubjects from "./pages/AdminSubjects";
import AdminResults from "./pages/AdminResults";
import AdminExams from "./pages/AdminExams";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        
        <Route
          path="/admin/students"
          element={<AdminStudents />}
        />

        <Route
          path="/admin/teachers"
          element={<AdminTeachers />}
        />  
        <Route
          path="/admin/courses"
          element={<AdminCourses />}
        />

        <Route
          path="/admin/subjects"
          element={<AdminSubjects />}
        />

        <Route
          path="/admin/exams"
          element={<AdminExams />}
        />

        <Route
          path="/admin/results"
          element={<AdminResults />}
        />

        <Route
          path="/admin/announcements"
          element={<AdminAnnouncements />}
        />
        
        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard />}
        />

        <Route
          path="/teacher/students"
          element={<TeacherStudents />}
        />

        <Route
          path="/teacher/results"
          element={<TeacherResults />}
        />

        <Route
          path="/teacher/attendance"
          element={<TeacherAttendance />}
        />

        <Route
          path="/teacher/announcements"
          element={<TeacherAnnouncements />}
        />
        
        <Route
          path="/teacher/profile"
          element={<TeacherProfile />}
        />

        <Route
          path="/teacher/settings"
          element={<TeacherSettings />}
        />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/results"
          element={<StudentResults />}
        />

        <Route
          path="/student/transcript"
          element={<StudentTranscript />}
        />

        <Route
          path="/student/notifications"
          element={<StudentNotifications />}
        />

        <Route
          path="/student/settings"
          element={<StudentSettings />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;