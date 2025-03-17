'use client';
function Navbar() {
  const handleGoogleLogin = async () => {
    try {
      await fetch('http://localhost:12094/auth/google/login', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error during Google login request:', error);
    }
  };
     return (<nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">BANK</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/maps" className="hover:text-gray-400">Find ATMs</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
          <a href="#" onClick={handleGoogleLogin} className="hover:text-gray-400">Login with Google</a>
        </div>
      </nav>);
}

export default Navbar;