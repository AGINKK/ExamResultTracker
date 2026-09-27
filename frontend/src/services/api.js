const API_BASE_URL = "http://localhost:5000";


// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};


// =====================================================
// RESPONSE HANDLER
// =====================================================

const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};


// =====================================================
// GET
// =====================================================

export const apiGet = async (endpoint) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(response);
};


// =====================================================
// POST
// =====================================================

export const apiPost = async (endpoint, data) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },

      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
};


// =====================================================
// PUT
// =====================================================

export const apiPut = async (endpoint, data) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },

      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
};


// =====================================================
// DELETE
// =====================================================

export const apiDelete = async (endpoint) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "DELETE",

      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(response);
};


// =====================================================
// AUTH
// =====================================================

export const loginUser = async (
  email,
  password
) => {
  return apiPost("/api/auth/login", {
    email,
    password,
  });
};


// =====================================================
// STUDENTS
// =====================================================

// GET ALL STUDENTS

export const getStudents = async () => {
  return apiGet("/api/students");
};


// GET STUDENT BY ID

export const getStudentById = async (id) => {
  return apiGet(`/api/students/${id}`);
};


// CREATE STUDENT

export const createStudent = async (data) => {
  return apiPost("/api/students", data);
};


// UPDATE STUDENT

export const updateStudent = async (
  id,
  data
) => {
  return apiPut(`/api/students/${id}`, data);
};


// DELETE STUDENT

export const deleteStudent = async (id) => {
  return apiDelete(`/api/students/${id}`);
};


// =====================================================
// COURSES
// =====================================================

// GET ALL COURSES

export const getCourses = async () => {
  return apiGet("/api/courses");
};


// GET COURSE BY ID

export const getCourseById = async (id) => {
  return apiGet(`/api/courses/${id}`);
};


// CREATE COURSE

export const createCourse = async (data) => {
  return apiPost("/api/courses", data);
};


// UPDATE COURSE

export const updateCourse = async (id, data) => {
  return apiPut(`/api/courses/${id}`, data);
};


// DELETE COURSE

export const deleteCourse = async (id) => {
  return apiDelete(`/api/courses/${id}`);
};


// =====================================================
// SUBJECTS
// =====================================================

// GET ALL SUBJECTS

export const getSubjects = async () => {
  return apiGet("/api/subjects");
};


// GET SUBJECT BY ID

export const getSubjectById = async (id) => {
  return apiGet(`/api/subjects/${id}`);
};


// CREATE SUBJECT

export const createSubject = async (data) => {
  return apiPost("/api/subjects", data);
};


// UPDATE SUBJECT

export const updateSubject = async (
  id,
  data
) => {
  return apiPut(`/api/subjects/${id}`, data);
};


// DELETE SUBJECT

export const deleteSubject = async (id) => {
  return apiDelete(`/api/subjects/${id}`);
};

// =====================================================
// TEACHERS
// =====================================================

// GET ALL TEACHERS
export const getTeachers = async () => {
  return apiGet("/api/teachers");
};

// GET TEACHER BY ID
export const getTeacherById = async (id) => {
  return apiGet(`/api/teachers/${id}`);
};

// GET CURRENT TEACHER DASHBOARD

export const getMyTeacherDashboard = async () => {
  return apiGet("/api/teachers/me/dashboard");
};

// CREATE TEACHER
export const createTeacher = async (data) => {
  return apiPost("/api/teachers", data);
};

// UPDATE TEACHER
export const updateTeacher = async (id, data) => {
  return apiPut(`/api/teachers/${id}`, data);
};

// DELETE TEACHER
export const deleteTeacher = async (id) => {
  return apiDelete(`/api/teachers/${id}`);
};

// =====================================================
// EXAMS
// =====================================================

// GET ALL EXAMS

export const getExams = async () => {
  return apiGet("/api/exams");
};


// GET EXAM BY ID

export const getExamById = async (id) => {
  return apiGet(`/api/exams/${id}`);
};


// CREATE EXAM

export const createExam = async (data) => {
  return apiPost("/api/exams", data);
};


// UPDATE EXAM

export const updateExam = async (
  id,
  data
) => {
  return apiPut(`/api/exams/${id}`, data);
};


// DELETE EXAM

export const deleteExam = async (id) => {
  return apiDelete(`/api/exams/${id}`);
};
// =====================================================
// RESULTS
// =====================================================

// GET ALL RESULTS

export const getResults = async () => {
  return apiGet("/api/results");
};


// GET RESULT BY ID

export const getResultById = async (id) => {
  return apiGet(`/api/results/${id}`);
};


// CREATE RESULT

export const createResult = async (data) => {
  return apiPost("/api/results", data);
};


// UPDATE RESULT

export const updateResult = async (
  id,
  data
) => {
  return apiPut(`/api/results/${id}`, data);
};


// DELETE RESULT

export const deleteResult = async (id) => {
  return apiDelete(`/api/results/${id}`);
};

// =====================================================
// ANNOUNCEMENTS
// =====================================================

// GET ALL ANNOUNCEMENTS

export const getAnnouncements = async () => {
  return apiGet("/api/announcements");
};
// GET ANNOUNCEMENTS FOR CURRENT TEACHER

export const getTeacherAnnouncements = async () => {
  return apiGet("/api/announcements/teacher");
};


// GET ANNOUNCEMENT BY ID

export const getAnnouncementById = async (id) => {
  return apiGet(`/api/announcements/${id}`);
};


// CREATE ANNOUNCEMENT

export const createAnnouncement = async (data) => {
  return apiPost("/api/announcements", data);
};


// UPDATE ANNOUNCEMENT

export const updateAnnouncement = async (
  id,
  data
) => {
  return apiPut(`/api/announcements/${id}`, data);
};


// DELETE ANNOUNCEMENT

export const deleteAnnouncement = async (id) => {
  return apiDelete(`/api/announcements/${id}`);
};

// =====================================================
// USER / ADMIN PROFILE
// =====================================================

// GET CURRENT LOGGED-IN USER PROFILE

export const getMyProfile = async () => {
  return apiGet("/api/users/me");
};


// UPDATE CURRENT LOGGED-IN USER PROFILE

export const updateMyProfile = async (data) => {
  return apiPut("/api/users/me", data);
};