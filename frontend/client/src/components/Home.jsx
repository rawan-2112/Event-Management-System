import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center text-center p-6 font-[Century_Schoolbook]"
      style={{
        backgroundImage: `url("/home.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <div className="relative z-10 max-w-3xl mx-auto text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg animate-fadeIn">
          Welcome to <br /> Event Management System
        </h1>

        <p className="text-lg md:text-xl mb-10 text-gray-200 animate-fadeIn delay-200">
          Choose your role to continue
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center animate-fadeIn delay-300">
          <Link
            to="/login?role=user"
            className="bg-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-900 hover:scale-105 transform transition text-lg"
          >
            Login as User
          </Link>
          <Link
            to="/login?role=admin"
            className="bg-white text-purple-800 border border-purple-300 px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-100 hover:scale-105 transform transition text-lg"
          >
            Login as Admin
          </Link>
        </div>

        <p className="mt-10 text-gray-200 animate-fadeIn delay-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-300 font-semibold underline hover:text-purple-100"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Home;
