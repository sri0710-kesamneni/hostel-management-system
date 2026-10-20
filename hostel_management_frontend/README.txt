HAVEN RESIDENCE MANAGEMENT — FRONTEND STARTER

FILES
1. login.html
2. dashboard.html
3. students.html
4. rooms.html
5. applications.html
6. allocations.html
7. payments.html
8. css/style.css
9. js/app.js

HOW TO RUN
1. Extract this folder.
2. Open it in VS Code.
3. For the best local preview, install the Live Server extension.
4. Right-click login.html and choose "Open with Live Server".
5. Sign in using admin@haven.edu and any password (demo only).
6. Use the sidebar to test the screens.

IMPORTANT DATABASE NOTE
This package is a front-end prototype. CRUD actions are saved in browser localStorage, not Oracle.
The demo login is NOT real authentication. Before submission, replace demo login and localStorage
operations with Java Servlet endpoints that validate users and execute SQL through JDBC.

Your known backend setup is Java Servlets + jakarta.servlet + Oracle JDBC + Tomcat 10.1+.
Connect the frontend to endpoints such as /students, /rooms, /applications, /allocations, and /payments.
Use fetch() with JSON or form-encoded requests according to the Servlet implementation, and never
trust client-side validation alone. Revalidate all business rules in Java and Oracle constraints.
